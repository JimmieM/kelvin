import { FC, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";

export interface DropdownItem {
  title: string;
  onClick: (value?: any) => void;
  onClickCallbackVal?: any;
  disabled?: boolean;
  hidden?: boolean;
}

interface SimpleDropdownProps {
  items: DropdownItem[];
}

export const SimpleDropdown: FC<SimpleDropdownProps> = ({ items }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="bg-gray-100 rounded-full flex items-center text-gray-400 hover:text-gray-600 dark:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
          <span className="sr-only">Open options</span>
          <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="dark:border-dark-700 dark:border cursor-pointer z-[99] origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-dark-900 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {items.map((item, idx) => (
              <Menu.Item key={idx}>
                {({ active }) => (
                  <button
                    disabled={item.disabled}
                    onClick={() => item.onClick(item.onClickCallbackVal)}
                    className={classNames(
                      active
                        ? "z-[10] bg-gray-100 text-gray-900 dark:text-slate-300 dark:bg-gray-800"
                        : "text-gray-700 dark:text-slate-200",
                      "block px-4 py-2 text-sm w-[100%] text-left"
                    )}
                  >
                    {item.title}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
