import { Dialog } from '@headlessui/react';
import { FaCheckCircle } from 'react-icons/fa';

interface SignoutPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignoutPrompt({ isOpen, onClose }: SignoutPromptProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className='relative z-50'
    >
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='bg-white rounded-lg p-6 max-w-sm w-full'>
          <div className='flex flex-col items-center text-center'>
            <FaCheckCircle className='w-12 h-12 text-green-500 mb-4' />
            <Dialog.Title className='text-xl font-semibold'>
              Transaction Complete!
            </Dialog.Title>
            <p className='mt-2 text-gray-600'>
              Would you like to sign out now?
            </p>
            <div className='flex gap-3 mt-6 w-full'>
              <button
                onClick={onClose}
                className='flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50'
              >
                Stay
              </button>
              <button
                onClick={() => {
                  // Add your signout logic here
                  onClose();
                }}
                className='flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700'
              >
                Sign Out
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
