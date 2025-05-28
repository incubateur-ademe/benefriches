import { ImpactFormatType } from "../../../shared/formatImpactValue";
import ImpactItemDetails, { ImpactItemDetailsProps } from "./ImpactItemDetails";
import ImpactItemGroup from "./ImpactItemGroup";
import { ImpactRowValueProps } from "./ImpactRowValue";

type Props = {
  label: string;
  labelProps: ImpactRowValueProps["labelProps"];
  actors: {
    label: string;
    value: number;
    details?: ImpactItemDetailsProps["data"];
  }[];
  type: ImpactFormatType | undefined;
};

const ImpactActorsItem = ({ label, actors, type, labelProps }: Props) => {
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
            labelProps={labelProps}
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
            labelProps={labelProps}
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
        labelProps={labelProps}
      />
    </ImpactItemGroup>
  ));
};

export default ImpactActorsItem;
