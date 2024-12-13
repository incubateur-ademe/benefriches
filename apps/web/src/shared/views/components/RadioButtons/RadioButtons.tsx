import DsfrRadioButtons from "@codegouvfr/react-dsfr/RadioButtons";
import { ChangeEventHandler, ReactNode } from "react";

type Props = {
  options: { value: string; label: string; hintText?: ReactNode }[];
  name: string;
  onChange: ChangeEventHandler;
  onBlur?: ChangeEventHandler;
  error?: { message?: string };
  ref: React.Ref<HTMLInputElement>;
};

function RadioButtons({ name, onChange, onBlur, options, error, ref }: Props) {
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
}

export default RadioButtons;
