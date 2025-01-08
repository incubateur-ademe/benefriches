import { ImpactDescriptionModalCategory } from "../impact-description-modals/ImpactDescriptionModalWizard";
import ImpactItemDetails from "./ImpactItemDetails";
import ImpactItemGroup from "./ImpactItemGroup";

type Props = {
  label: string;
  descriptionModalId?: ImpactDescriptionModalCategory;
  actors: {
    label: string;
    value: number;
    details?: {
      label: string;
      value: number;
      descriptionModalId?: ImpactDescriptionModalCategory;
    }[];
  }[];
  type?: "surfaceArea" | "monetary" | "co2" | "default" | "etp" | "time" | undefined;
};

const ImpactActorsItem = ({ label, actors, type, descriptionModalId }: Props) => {
  const [firstActor, ...othersActors] = actors;
  const isClickable =
    !!descriptionModalId || (!!firstActor?.details && firstActor.details.length > 0);
  return (
    <ImpactItemGroup isClickable={isClickable}>
      {firstActor && (
        <ImpactItemDetails
          value={firstActor.value}
          label={label}
          actor={firstActor.label}
          data={firstActor.details}
          type={type}
          descriptionModalId={descriptionModalId}
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
};

export default ImpactActorsItem;
