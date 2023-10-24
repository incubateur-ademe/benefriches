import { ChangeEventHandler, forwardRef } from "react";
import DsfrRadioButtons from "@codegouvfr/react-dsfr/RadioButtons";

type Props = {
  options: { value: string; label: string }[];
  name: string;
  onChange: ChangeEventHandler;
  onBlur?: ChangeEventHandler;
  error?: { message?: string };
};

const RadioButtons = forwardRef<HTMLInputElement, Props>(function _RadioButtons(
  { name, onChange, onBlur, options, error },
  ref,
) {
  const mappedOptions = options.map(({ value, label }) => ({
    label,
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
