import { fr } from "@codegouvfr/react-dsfr";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

import classNames, { ClassValue } from "../../clsx";

type Props = {
  options: { label: string; value: string }[];
  value?: string;
  onSelect: (value: string) => void;
  className?: ClassValue;
  children: ReactNode;
};

const SCROLLBAR_CLASSES = [
  "tw-overflow-auto",
  "[&::-webkit-scrollbar]:tw-w-1",
  "[&::-webkit-scrollbar-track]:tw-bg-gray-100",
  "[&::-webkit-scrollbar-thumb]:tw-bg-gray-300",
  "dark:[&::-webkit-scrollbar-track]:tw-bg-neutral-700",
  "dark:[&::-webkit-scrollbar-thumb]:tw-bg-neutral-500",
];

function Autocomplete({ options, value, onSelect, className, children }: Props) {
  return (
    <div className={classNames(className)}>
      <Combobox value={value} onChange={onSelect}>
        <ComboboxInput as={Fragment}>{children}</ComboboxInput>
        <ComboboxOptions anchor="bottom start">
          <ul
            className={classNames(
              fr.cx("fr-menu__list"),
              "tw-max-h-72",
              ...SCROLLBAR_CLASSES,
              "tw-w-[var(--input-width)]",
              "empty:tw-invisible",
              "tw-my-1 tw-py-1",
              "tw-rounded-md",
              "tw-shadow-lg",
              "tw-border-gray-200",
              "tw-border",
              "tw-border-solid",
              "tw-ring-1 tw-ring-black/5",
              "tw-bg-[var(--background-overlap-grey)]",
            )}
          >
            {options.map((option) => (
              <ComboboxOption as={Fragment} key={option.value} value={option.value}>
                {({ focus, selected }) => (
                  <li
                    className={classNames(
                      fr.cx("fr-nav__link"),
                      focus && "tw-bg-dsfr-altBlue",
                      selected && "tw-bg-dsfr-openBlue",
                      "tw-cursor-pointer",
                    )}
                  >
                    {selected && <i className="tw-size-5"></i>}
                    {option.label}
                  </li>
                )}
              </ComboboxOption>
            ))}
          </ul>
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}

export default Autocomplete;
