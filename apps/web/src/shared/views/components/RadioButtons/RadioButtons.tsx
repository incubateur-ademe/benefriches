import { ChangeEventHandler, forwardRef, ReactNode } from "react";
import DsfrRadioButtons from "@codegouvfr/react-dsfr/RadioButtons";

type Props = {
  options: { value: string; label: string; hintText?: ReactNode }[];
  name: string;
  onChange: ChangeEventHandler;
  onBlur?: ChangeEventHandler;
  error?: { message?: string };
};

const RadioButtons = forwardRef<HTMLInputElement, Props>(function _RadioButtons(
  { name, onChange, onBlur, options, error },
  ref,
) {
  const mappedOptions = options.map(({ value, label, hintText }) => ({
    label,
    hintText,
    nativeInputProps: {
      name,
      value,
      onChange,
      onBlur,
      ref,
    },
  }));

  return (
    <DsfrRadioButtons
      options={mappedOptions}
      state={error ? "error" : "default"}
      stateRelatedMessage={error ? error.message : undefined}
    />
  );
});

export default RadioButtons;
