import type { RowNumericInputInputProps } from "./RowNumericInput";
import RowNumericInput from "./RowNumericInput";

const RowDecimalsNumericInput = ({ nativeInputProps, ...props }: RowNumericInputInputProps) => {
  return <RowNumericInput nativeInputProps={{ ...nativeInputProps, step: "0.01" }} {...props} />;
};

export default RowDecimalsNumericInput;
