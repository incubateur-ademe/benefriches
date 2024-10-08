import DsfrRadioButtons from "@codegouvfr/react-dsfr/RadioButtons";
import { ChangeEventHandler, forwardRef, ReactNode } from "react";

type Props = {
  options: { value: string; label: string; hintText?: ReactNode }[];
  name: string;
  onChange: ChangeEventHandler;
  onBlur?: ChangeEventHandler;
  error?: { message?: string };
};

const RadioButtons = forwardRef<HTMLInputElement, Props>(function BaseRadioButtons(baseProps, ref) {
  // props are not destructured nor named 'props' here because of an issue with eslint-plugin-react when using forwardRef
  // see https://github.com/jsx-eslint/eslint-plugin-react/issues/3796
  const { name, onChange, onBlur, options, error } = baseProps;
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
