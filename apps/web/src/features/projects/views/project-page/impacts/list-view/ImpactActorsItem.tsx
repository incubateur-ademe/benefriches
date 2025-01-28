import ImpactItemDetails from "./ImpactItemDetails";
import ImpactItemGroup from "./ImpactItemGroup";

type Props = {
  label: string;
  onClick: () => void;
  actors: {
    label: string;
    value: number;
    details?: {
      label: string;
      value: number;
      onClick: () => void;
    }[];
  }[];
  type?: "surfaceArea" | "monetary" | "co2" | "default" | "etp" | "time" | undefined;
};

const ImpactActorsItem = ({ label, actors, type, onClick }: Props) => {
  const [firstActor, ...othersActors] = actors;

  if (!firstActor?.details) {
    return (
      <ImpactItemGroup isClickable>
        {firstActor && (
          <ImpactItemDetails
            value={firstActor.value}
            label={label}
            actor={firstActor.label}
            type={type}
            onClick={onClick}
          />
        )}
        {othersActors.map(({ label: actor, value, details = [] }) => (
          <ImpactItemDetails
            label=""
            type={type}
            key={actor}
            value={value}
            actor={actor}
            data={details}
            onClick={onClick}
          />
        ))}
      </ImpactItemGroup>
    );
  }

  return actors.map(({ label: actor, value, details = [] }) => (
    <ImpactItemGroup isClickable key={actor}>
      <ImpactItemDetails
        value={value}
        label={label}
        actor={actor}
        data={details}
        type={type}
        onClick={onClick}
      />
    </ImpactItemGroup>
  ));
};

export default ImpactActorsItem;
