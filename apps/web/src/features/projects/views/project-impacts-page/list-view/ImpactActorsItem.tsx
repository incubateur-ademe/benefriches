import ImpactItem from "./ImpactItem";
import ImpactItemGroup from "./ImpactItemGroup";
import ImpactRowValue from "./ImpactRowValue";

import classNames from "@/shared/views/clsx";

type Props = {
  label: string;
  onClick?: () => void;
  actors: {
    label: string;
    value: number;
    details?: { label: string; value: number; onClick?: () => void }[];
  }[];
  type: "surfaceArea" | "monetary" | "co2" | "default" | undefined;
};

const ImpactActorsItem = ({ label, actors, type, onClick }: Props) => (
  <ImpactItemGroup>
    <ImpactRowValue onClick={onClick}>
      <span className={classNames("tw-pt-4", "tw-font-bold")}>{label}</span>
    </ImpactRowValue>

    {actors.map(({ label: actor, value, details = [] }) => (
      <ImpactItem label={actor} value={value} data={details} type={type} key={actor} />
    ))}
  </ImpactItemGroup>
);

export default ImpactActorsItem;
