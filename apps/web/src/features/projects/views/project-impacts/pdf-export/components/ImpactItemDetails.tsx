import { View } from "@react-pdf/renderer";

import { ImpactFormatType } from "../../../shared/formatImpactValue";
import { tw } from "../styles";
import ImpactRowValue from "./ImpactRowValue";

export type ImpactItemDetailsProps = {
  label: string;
  actor?: string;
  value: number;
  data?: { label: string; value: number }[];
  type: ImpactFormatType | undefined;
};

const ImpactItemDetails = ({ label, value, actor, data, type }: ImpactItemDetailsProps) => {
  const hasData = data && data.length > 0;

  return (
    <>
      <ImpactRowValue label={label} actor={actor} value={value} valueType={type} isTotal />
      {hasData && (
        <View style={tw("pl-4")}>
          {data.map(({ label: detailsLabel, value: detailsValue }) => (
            <ImpactRowValue
              value={detailsValue}
              valueType={type}
              key={detailsLabel}
              label={detailsLabel}
            />
          ))}
        </View>
      )}
    </>
  );
};

export default ImpactItemDetails;
