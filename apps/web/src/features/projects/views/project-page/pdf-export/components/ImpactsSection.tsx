import { View } from "@react-pdf/renderer";

import { ImpactFormatType } from "../../../shared/formatImpactValue";
import { concatClassNames, tw } from "../styles";
import ImpactRowValue from "./ImpactRowValue";

type Props = {
  title: string;
  isMain?: boolean;
  total?: number;
  children: React.ReactNode;
  valueType?: ImpactFormatType;
};

export default function ImpactsSection({ title, isMain, total, valueType, children }: Props) {
  return (
    <View style={tw("bg-grey-light mb-6 p-4")}>
      <View style={tw(concatClassNames("px-4 w-full rounded-sm mb-2"))}>
        <ImpactRowValue label={title} isMain={isMain} value={total} valueType={valueType} isTotal />
      </View>
      <View style={tw("flex flex-col gap-4")}>{children}</View>
    </View>
  );
}
