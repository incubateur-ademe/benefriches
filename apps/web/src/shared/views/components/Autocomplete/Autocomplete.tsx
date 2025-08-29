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
  "overflow-auto",
  "[&::-webkit-scrollbar]:w-1",
  "[&::-webkit-scrollbar-track]:bg-gray-100",
  "[&::-webkit-scrollbar-thumb]:bg-gray-300",
  "dark:[&::-webkit-scrollbar-track]:bg-neutral-700",
  "dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500",
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
              "max-h-72",
              ...SCROLLBAR_CLASSES,
              "w-[var(--input-width)]",
              "empty:invisible",
              "my-1 py-1",
              "rounded-md",
              "shadow-lg",
              "border-gray-200",
              "border",
              "border-solid",
              "ring-1 ring-black/5",
              "bg-[var(--background-overlap-grey)]",
            )}
          >
            {options.map((option) => (
              <ComboboxOption as={Fragment} key={option.value} value={option.value}>
                {({ focus, selected }) => (
                  <li
                    className={classNames(
                      fr.cx("fr-nav__link"),
                      focus && "bg-dsfr-altBlue",
                      selected && "bg-dsfr-openBlue",
                      "cursor-pointer",
                    )}
                  >
                    {selected && <i className="size-5"></i>}
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
