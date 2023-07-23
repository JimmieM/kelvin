import classNames from 'classnames';
import { FC } from 'react';

interface SimpleInputProps {
   value?: any;
   onChange?: (value: any) => void;
   onKeyPress?: (event: any) => void;
   leftIcon?: any;
   leftIconOnClick?: () => void;
   leftAddon?: JSX.Element;
   label?: string;
   placeholder?: string;
   type?: 'text' | 'email' | 'number';
   disabled?: boolean;
   required?: boolean;
   autoFocus?: boolean;
}

export const Input: FC<SimpleInputProps> = (props) => {
   const {
      leftIconOnClick,
      label,
      leftIcon,
      onChange,
      value,
      placeholder,
      type,
      disabled,
      onKeyPress,
      leftAddon,
      required,
      autoFocus,
   } = props;

   return (
      <div>
         {label && (
            <label
               htmlFor="company-website"
               className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
               {label}
            </label>
         )}
         <div className="flex relative">
            {leftIcon && (
               <props.leftIcon
                  onClick={leftIconOnClick}
                  className={classNames(
                     'w-9 h-9 p-1 flex self-center text-gray-500 sm:text-sm',
                     !!leftIconOnClick &&
                        'cursor-pointer hover:text-indigo-500',
                  )}
               />
            )}
            {leftAddon && (
               <div className="pr-3 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {leftAddon}
               </div>
            )}
            <input
               autoFocus={autoFocus}
               required={required}
               onKeyDownCapture={onKeyPress}
               disabled={disabled}
               value={value ?? ''}
               onChange={({ target }) => onChange?.(target.value)}
               type={type || 'text'}
               name={label || placeholder}
               className="mt-1 block w-full border border-gray-300 dark:border-dark-600 dark:bg-dark-800 dark:text-slate-200 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
               placeholder={placeholder ?? label}
            />
         </div>
      </div>
   );
};
