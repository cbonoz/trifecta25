import { Dialog } from '@headlessui/react';

interface RewardsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  points: number | null;
  pointsToNextReward: number | null;
}

export function RewardsDialog({
  isOpen,
  onClose,
  points,
  pointsToNextReward,
}: RewardsDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className='relative z-50'
    >
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='bg-white rounded-lg p-6 max-w-sm w-full'>
          <Dialog.Title className='text-lg font-medium'>
            Your Rewards
          </Dialog.Title>
          <div className='mt-4'>
            {points !== null && (
              <>
                <p>Current Points Balance: {points}</p>
                <p className='mt-2'>
                  Amount needed for next reward: {pointsToNextReward}
                </p>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className='mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700'
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
