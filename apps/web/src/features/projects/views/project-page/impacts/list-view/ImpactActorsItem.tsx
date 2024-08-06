import ImpactItem from "./ImpactItemDetails";
import ImpactItemGroup from "./ImpactItemGroup";

type Props = {
  label: string;
  onClick?: () => void;
  actors: {
    label: string;
    value: number;
    details?: { label: string; value: number; onClick?: () => void }[];
  }[];
  type?: "surfaceArea" | "monetary" | "co2" | "default" | "etp" | "time" | undefined;
};

const ImpactActorsItem = ({ label, actors, type, onClick }: Props) => {
  const [firstActor, ...othersActors] = actors;
  return (
    <ImpactItemGroup onClick={onClick}>
      {firstActor && (
        <ImpactItem
          value={firstActor.value}
          label={label}
          actor={firstActor.label}
          data={firstActor.details}
          type={type}
          isTotal
        />
      )}

      {othersActors.map(({ label: actor, value, details = [] }) => (
        <ImpactItem type={type} key={actor} value={value} actor={actor} data={details} isTotal />
      ))}
    </ImpactItemGroup>
  );
};

export default ImpactActorsItem;
