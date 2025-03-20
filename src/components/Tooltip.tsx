import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface TooltipProps {
  content: string;
}

export function Tooltip({ content }: TooltipProps) {
  return (
    <div className="group relative inline-block ml-1">
      <InformationCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-500" />
      <div className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex flex-col items-center">
          <div className="whitespace-nowrap rounded bg-black px-3 py-2 text-xs text-white">
            {content}
          </div>
          <div className="h-2 w-2 rotate-45 transform bg-black"></div>
        </div>
      </div>
    </div>
  );
}
