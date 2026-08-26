import { ImpactFormatType } from "../../../shared/formatImpactValue";
import ImpactItemDetails, { ImpactItemDetailsProps } from "./ImpactItemDetails";
import ImpactItemGroup from "./ImpactItemGroup";

type Props = {
  label: string;
  actors: {
    label: string;
    value: number;
    details?: ImpactItemDetailsProps["data"];
  }[];
  type: ImpactFormatType | undefined;
};

const ImpactsGroupByActor = ({ label, actors, type }: Props) => {
  const [firstActor, ...othersActors] = actors;

  if (!firstActor?.details) {
    return (
      <ImpactItemGroup>
        {firstActor && (
          <ImpactItemDetails
            value={firstActor.value}
            label={label}
            actor={firstActor.label}
            type={type}
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
          />
        ))}
      </ImpactItemGroup>
    );
  }

  return actors.map(({ label: actor, value, details = [] }) => (
    <ImpactItemGroup key={actor}>
      <ImpactItemDetails value={value} label={label} actor={actor} data={details} type={type} />
    </ImpactItemGroup>
  ));
};

export default ImpactsGroupByActor;
