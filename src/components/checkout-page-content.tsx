'use client';

import { useChat } from 'ai/react';
import { ethers } from 'ethers';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useAccount } from 'wagmi';

import { useEthersSigner } from '@/app/contexts/useEthersSigner';
import { BusinessInfo as BusinessInfoComponent } from '@/components/business-info';
import { RewardsDialog } from '@/components/rewards-dialog';
import { SignoutPrompt } from '@/components/signout-prompt';
import { CHAT_API_URL, DEMO_FORM_DATA } from '@/constant';
import { siteConfig } from '@/constant/config';
import SinglefactAbi from '@/contracts/Singlefact.json';
import { getEthConversionRate } from '@/lib/fetch';
import { BusinessInfo } from '@/lib/types';

export default function AttestationPageContent() {
  const { attestationId } = useParams();
  const { address } = useAccount();
  const signer = useEthersSigner({
    chainId: siteConfig.defaultChain.id as any,
  });
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSignoutPrompt, setShowSignoutPrompt] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [showRewardPopup, setShowRewardPopup] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      api: CHAT_API_URL,
      id: attestationId as string,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${process.env.NEXT_PUBLIC_CHAT_USER_KEY}`,
      },
      onResponse: async (response) => {
        console.log('response', response);
        const data = await response.json();

        const receivedMessages = data.response || data;
        const newMessages = receivedMessages.map((content: string) => ({
          id: Date.now().toString(),
          role: 'assistant',
          content,
        }));
        setMessages((prevMessages: any) => [...prevMessages, ...newMessages]);

        if (
          input.toLowerCase().includes('claim') &&
          input.toLowerCase().includes('reward')
        ) {
          console.log('detected claim reward request');
          claimReward();
        }

        // get last message
        const lastMessage = newMessages[newMessages.length - 1].content;

        if (lastMessage.toLowerCase().includes('please confirm sending $')) {
          console.log('detected record transaction request');
          // extract the money amount using a regex
          const amount = lastMessage.match(/(\d+\.?\d*)/)?.[0];
          // convert
          const { data } = await getEthConversionRate();
          const ethAmount = amount / data.USD;

          // log values
          console.log('send:', amount, data.USD, ethAmount);

          sendTransaction(ethAmount.toString());
        }
      },
    });

  const claimReward = async () => {
    if (!address || !signer || !attestationId) return;

    try {
      setLoading(true);
      const contract = new ethers.Contract(
        siteConfig.contractAddress,
        SinglefactAbi.abi,
        signer,
      );

      const tx = await contract.claimReward(attestationId, address);
      await tx.wait();

      setShowRewardPopup(true);
      checkRewards();
    } catch (error) {
      console.error('Reward claim failed:', error);
      alert('Unable to claim reward. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paymentPrompt =
      "If it seems like the user wants to make a payment and sends an amount, return 'Please confirm sending $X' where X is the amount in USD";
    const messageContent = isFirstMessage
      ? `Business Context: ${businessInfo?.businessContext}. The user's current points/visits is ${points} and needs minimum ${businessInfo?.rewardThreshold} for a reward. ${paymentPrompt}.\n${input}`
      : input;

    handleSubmit(e, {
      body: {
        message: messageContent,
      },
    });

    setIsFirstMessage(false);
  };

  const sendTransaction = async (amount: string) => {
    if (!address || !signer || !attestationId || !businessInfo) return;

    const ethAmount = parseFloat(amount);
    if (ethAmount < 0.001) {
      alert('Minimum transaction amount is 0.001 ETH');
      return;
    }

    try {
      setLoading(true);
      const contract = new ethers.Contract(
        siteConfig.contractAddress,
        SinglefactAbi.abi,
        signer,
      );

      const tx = await contract.recordTransaction(
        attestationId,
        businessInfo.paymentAddress,
        {
          value: ethers.parseEther(amount.substr(0, 10)),
        },
      );
      await tx.wait();

      //   alert('Transaction recorded successfully!');
      // refresh data
      checkRewards();
      setShowSignoutPrompt(true);
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkRewards = async (openModal?: boolean) => {
    if (!address || !signer || !attestationId) return;

    try {
      const contract = new ethers.Contract(
        siteConfig.contractAddress,
        SinglefactAbi.abi,
        signer,
      );
      const res = await contract.getPoints(attestationId, address);
      const p = Number(res);
      console.log('points', p);

      setPoints(p);
      if (openModal) {
        setIsRewardsOpen(true);
      }
    } catch (error) {
      console.error('Error checking rewards:', error);
      alert('Error checking rewards. Please try again.');
    }
  };

  const fetchBusinessInfo = async () => {
    if (!signer || !attestationId) return;

    try {
      setError(null);
      const contract = new ethers.Contract(
        siteConfig.contractAddress,
        SinglefactAbi.abi as any,
        signer,
      );

      const info = await contract.getBusinessInfo(attestationId);

      if (!info || !info[1]) {
        throw new Error('Invalid business data received');
      }

      console.log('Business info:', info);

      // convert bigint to number
      const rewardThreshold = Number(info[2]);
      const rewardAmount = Number(info[3]);

      setBusinessInfo({
        owner: info[0],
        name: info[1],
        rewardThreshold,
        rewardAmount,
        isActive: info[4],
        paymentAddress: info[5],
        businessContext: info[6],
      });
    } catch (error: any) {
      console.error('Error fetching business info:', error);
      alert('Error fetching business info. Please try again.');
      setBusinessInfo(DEMO_FORM_DATA);
    }
  };

  useEffect(() => {
    if (signer && attestationId) {
      fetchBusinessInfo();
      checkRewards();
    }
  }, [signer, attestationId]);

  const calculatePointsToNextReward = () => {
    if (!businessInfo || points === null) return null;
    const threshold = Number(businessInfo.rewardThreshold);
    // make sure points is a number else return 0
    if (isNaN(points)) return 0;

    return Math.max(0, threshold - points || 0);
  };

  const handleExampleQuestionClick = (question: string) => {
    handleInputChange({ target: { value: question } } as any);
  };

  return (
    <div className='container mx-auto p-6'>
      {error ? (
        <div className='max-w-lg mx-auto bg-red-50 border-l-4 border-red-500 p-4 rounded-md'>
          <div className='flex items-center gap-3'>
            <FaExclamationTriangle className='text-red-500 w-6 h-6' />
            <div>
              <h3 className='text-lg font-medium text-red-800'>
                Error Loading Business
              </h3>
              <p className='text-red-600'>{error}</p>
              <button
                onClick={() => fetchBusinessInfo()}
                className='mt-2 text-red-700 hover:text-red-800 underline'
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className='grid lg:grid-cols-[400px,1fr] gap-6'>
          <div className='lg:sticky lg:top-6 lg:self-start'>
            {businessInfo && (
              <BusinessInfoComponent
                businessInfo={businessInfo}
                currentPoints={points}
              />
            )}
          </div>

          <div className='space-y-6'>
            {!address ? (
              <p className='text-red-500'>
                Please connect your wallet to continue
              </p>
            ) : (
              <>
                <div className='space-y-4'>
                  <div className='h-[500px] overflow-y-auto border rounded-md p-4 bg-white shadow-sm'>
                    {messages.map((message: any) => (
                      <div
                        key={message.id}
                        className={`mb-2 ${
                          message.role === 'assistant'
                            ? 'text-blue-600'
                            : 'text-gray-800'
                        }`}
                      >
                        <strong>
                          {message.role === 'assistant' ? 'AI: ' : 'You: '}
                        </strong>
                        {message.content}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleFormSubmit} className='flex gap-2'>
                    <input
                      value={input}
                      onChange={handleInputChange}
                      className='flex-1 rounded-md border border-gray-300 p-2'
                      placeholder='Chat with AI assistant...'
                    />
                    <button
                      type='submit'
                      disabled={loading}
                      className='bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50'
                    >
                      Send
                    </button>
                  </form>

                  <div className='mt-4'>
                    <h3 className='text-sm font-medium text-gray-600 mb-2'>
                      Example prompts:
                    </h3>
                    <ul className='list-disc list-inside text-gray-600 space-y-2'>
                      <li>
                        <button
                          type='button'
                          onClick={() =>
                            handleExampleQuestionClick(
                              'How many visits do I need to next reward?',
                            )
                          }
                          className='text-blue-600 hover:underline'
                        >
                          How many visits do I need to next reward?
                        </button>
                      </li>
                      <li>
                        <button
                          type='button'
                          onClick={() =>
                            handleExampleQuestionClick(
                              'What offerings do you have?',
                            )
                          }
                          className='text-blue-600 hover:underline'
                        >
                          What offerings do you have?
                        </button>
                      </li>
                      <li>
                        <button
                          type='button'
                          onClick={() =>
                            handleExampleQuestionClick('I want to pay $5')
                          }
                          className='text-blue-600 hover:underline'
                        >
                          I want to pay $5
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* <button
                    onClick={() => checkRewards(true)}
                    className='w-full border border-primary-600 text-primary-600 py-2 px-4 rounded-md hover:bg-primary-50'
                  >
                    Check Rewards
                  </button> */}

                  {/* <button
                    onClick={() => handleTransaction('0.001')}
                    className='w-full border border-primary-600 text-primary-600 py-2 px-4 rounded-md hover:bg-primary-50'
                  >
                    Record Transaction
                  </button> */}
                </div>

                <RewardsDialog
                  isOpen={isRewardsOpen}
                  onClose={() => setIsRewardsOpen(false)}
                  points={points}
                  pointsToNextReward={calculatePointsToNextReward()}
                />

                <SignoutPrompt
                  isOpen={showSignoutPrompt}
                  onClose={() => setShowSignoutPrompt(false)}
                />

                {showRewardPopup && (
                  <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white p-6 rounded-md'>
                      <h2 className='text-xl font-semibold mb-4'>
                        Reward Claimed Successfully!
                      </h2>
                      <p className='mb-4'>
                        Please show this message to the cashier to redeem your
                        reward.
                      </p>
                      <button
                        onClick={() => setShowRewardPopup(false)}
                        className='bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700'
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
