import { fr } from "@codegouvfr/react-dsfr";
import Input, { InputProps } from "@codegouvfr/react-dsfr/Input";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { ComponentPropsWithRef, Fragment } from "react";

import classNames, { ClassValue } from "../../clsx";

type Props = {
  options: { label: string; value: string }[];
  value?: string;
  onSelect: (value: string) => void;
  className?: ClassValue;
  inputProps: InputProps.RegularInput;
};

const SCROLLBAR_CLASSES = [
  "overflow-auto",
  "[&::-webkit-scrollbar]:w-1",
  "[&::-webkit-scrollbar-track]:bg-gray-100",
  "[&::-webkit-scrollbar-thumb]:bg-gray-300",
  "dark:[&::-webkit-scrollbar-track]:bg-neutral-700",
  "dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500",
];

type ComboboxNativeInputProps = Omit<ComponentPropsWithRef<"input">, "defaultValue"> & {
  defaultValue?: string;
  dsfrInputProps: Omit<InputProps.RegularInput, "nativeInputProps">;
};

/**
 * HeadlessUI's <ComboboxInput> renders whatever it's given as `as` and injects its own DOM
 * wiring (ref, onChange/onKeyDown/onFocus/onBlur, role="combobox", aria-*) directly onto it,
 * expecting that element to forward all of it straight to a real native <input>. DSFR's <Input>
 * instead forwards its own `ref` (and any unrecognised props) to its OUTER wrapping <div> — so
 * used directly, HeadlessUI's wiring would land on that div instead of the actual input: broken
 * aria attributes, and a crash the moment HeadlessUI's own effects call
 * `inputRef.current.setSelectionRange(...)`, since a <div> has no such method (hit both via
 * Playwright's `fill()` and via the browser's native "clear" (×) button on `type="search"`
 * fields, which mutates the DOM value directly the same way).
 *
 * This adapter is what HeadlessUI actually clones/injects into, and routes everything —
 * including `ref` — into `nativeInputProps`, which DSFR's <Input> spreads directly onto the
 * real <input> element.
 */
function ComboboxNativeInput({
  ref,
  dsfrInputProps,
  ...nativeInputProps
}: ComboboxNativeInputProps) {
  return <Input {...dsfrInputProps} nativeInputProps={{ ...nativeInputProps, ref }} />;
}

function Autocomplete({ options, value, onSelect, className, inputProps }: Props) {
  const { nativeInputProps, ...dsfrInputProps } = inputProps;
  // `defaultValue` is typed as `string | number | readonly string[]` on nativeInputProps (the
  // generic HTML input attributes shape) but ComboboxInput narrows it to `string`; this field is
  // unused by every current caller of Autocomplete, so drop it rather than widen the adapter.
  const { defaultValue: _unusedDefaultValue, ...nativeInputPropsWithoutDefaultValue } =
    nativeInputProps ?? {};

  return (
    <div className={classNames(className)}>
      <Combobox
        value={value}
        onChange={(value) => {
          if (value) {
            onSelect(value);
          }
        }}
      >
        <ComboboxInput
          as={ComboboxNativeInput}
          dsfrInputProps={dsfrInputProps}
          // Keeps HeadlessUI's own DOM-value restoration (it writes to the input's value
          // outside of React whenever the combobox's selected value changes) consistent with
          // the label the consumer already displays for that same value, instead of falling
          // back to the raw option value (e.g. a BAN id) once no `displayValue` is given.
          displayValue={(optionValue: string) =>
            options.find((option) => option.value === optionValue)?.label ?? ""
          }
          {...nativeInputPropsWithoutDefaultValue}
        />
        <ComboboxOptions anchor="bottom start">
          <ul
            className={classNames(
              fr.cx("fr-menu__list"),
              "max-h-72",
              ...SCROLLBAR_CLASSES,
              "w-(--input-width)",
              "empty:invisible",
              "my-1 py-1",
              "rounded-md",
              "shadow-lg",
              "border-gray-200",
              "border",
              "border-solid",
              "ring-1 ring-black/5",
              "bg-(--background-overlap-grey)",
            )}
          >
            {options.map((option) => (
              <ComboboxOption as={Fragment} key={option.value} value={option.value}>
                {({ focus }) => (
                  <li
                    className={classNames(
                      fr.cx("fr-nav__link"),
                      focus && "bg-dsfr-alt-blue",
                      option.value === value && "bg-dsfr-open-blue",
                      "cursor-pointer",
                      "justify-start",
                    )}
                  >
                    {option.value === value && <i className="fr-icon-check-line mr-1.5"></i>}
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
