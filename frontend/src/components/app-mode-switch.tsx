import classNames from 'classnames';
import { FC } from 'react';
import { AppMode } from '../App';

interface AppSwitchButtonProps {
   mode: AppMode;
   onChange: (mode: AppMode) => void;
}

export const AppSwitchButton: FC<AppSwitchButtonProps> = ({
   mode,
   onChange,
}) => {
   return (
      <div
         className="flex space-x-1 rounded-lg p-0.5 bg-black"
         role="tablist"
         aria-orientation="horizontal"
      >
         <button
            onClick={() => onChange('wall')}
            className={classNames(
               'flex items-center rounded-md py-[0.4375rem] pl-2 pr-2 text-sm font-semibold lg:pr-3',
               mode === 'wall' && 'bg-gray-900 shadow',
            )}
            role="tab"
            type="button"
            aria-selected={mode === 'wall'}
            tabIndex={0}
         >
            <svg
               className="h-5 w-5 flex-none stroke-sky-500"
               fill="none"
               strokeWidth="1.5"
               strokeLinecap="round"
               strokeLinejoin="round"
               xmlns="http://www.w3.org/2000/svg"
            >
               <path d="M17.25 10c0 1-1.75 6.25-7.25 6.25S2.75 11 2.75 10 4.5 3.75 10 3.75 17.25 9 17.25 10Z"></path>
               <circle cx="10" cy="10" r="2.25"></circle>
            </svg>
            <span className="sr-only lg:not-sr-only lg:ml-2 text-slate-200">
               Wall
            </span>
         </button>
         <button
            onClick={() => onChange('chat')}
            className={classNames(
               'flex items-center rounded-md py-[0.4375rem] pl-2 pr-2 text-sm font-semibold lg:pr-3',
               mode === 'chat' && 'bg-gray-900 shadow',
            )}
            role="tab"
            type="button"
            aria-selected={mode === 'chat'}
            tabIndex={-1}
         >
            <svg
               className="h-5 w-5 flex-none stroke-slate-600"
               fill="none"
               strokeWidth="1.5"
               strokeLinecap="round"
               strokeLinejoin="round"
               xmlns="http://www.w3.org/2000/svg"
            >
               <path d="m13.75 6.75 3.5 3.25-3.5 3.25M6.25 13.25 2.75 10l3.5-3.25"></path>
            </svg>
            <span className="sr-only lg:not-sr-only lg:ml-2 text-slate-200">
               Chat
            </span>
         </button>
      </div>
   );
};
