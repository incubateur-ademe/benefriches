import { Text, View } from "@react-pdf/renderer";
import { isValidElement } from "react";

import { concatClassNames, tw } from "../styles";

type DataLineProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  bold?: boolean;
  isDetails?: boolean;
  noBorder?: boolean;
  labelClassName?: string;
};

export default function DataLine({
  label,
  value,
  bold,
  isDetails = false,
  noBorder = false,
  labelClassName = "",
}: DataLineProps) {
  const borderStyle = isDetails ? "border-l-black border-l" : "border-b border-borderGrey";
  const styles = concatClassNames(
    "flex flex-row justify-between",
    bold ? "font-bold" : "",
    noBorder ? "" : borderStyle,
  );

  const labelStyles = tw(concatClassNames("py-2", isDetails ? "pl-4" : "", labelClassName));
  const valueStyles = tw("p-2 w-[30%] text-right bg-greyLight");

  return (
    <View style={tw(styles)}>
      <View style={labelStyles}>{isValidElement(label) ? label : <Text>{label}</Text>}</View>
      <View style={valueStyles}>{isValidElement(value) ? value : <Text>{value}</Text>}</View>
    </View>
  );
}
