import RowNumericInput, { RowNumericInputInputProps } from "./RowNumericInput";

const RowDecimalsNumericInput = ({ nativeInputProps, ...props }: RowNumericInputInputProps) => {
  return <RowNumericInput nativeInputProps={{ ...nativeInputProps, step: "0.01" }} {...props} />;
};

export default RowDecimalsNumericInput;
