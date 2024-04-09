import Button from "@codegouvfr/react-dsfr/Button";
import { ImpactDescriptionModalCategory } from "../../ImpactDescriptionModalWizard";

type Props = {
  onChangeModalCategoryOpened: (modalCategory: ImpactDescriptionModalCategory) => void;
};

const PermeableSurfaceDescription = ({ onChangeModalCategoryOpened }: Props) => {
  return (
    <>
      <p>
        Il s’agit de la surface qui n’est pas imperméabilisée et permet ainsi l’infiltration de
        l’eau de pluie sur la parcelle. La surface perméable peut être{" "}
        <Button
          onClick={() => {
            onChangeModalCategoryOpened("environmental-minerale-surface");
          }}
          priority="tertiary no outline"
        >
          🪨 minérale
        </Button>{" "}
        ou{" "}
        <Button
          onClick={() => {
            onChangeModalCategoryOpened("environmental-green-surface");
          }}
          priority="tertiary no outline"
        >
          ☘️ végétalisée
        </Button>
        .
      </p>
      <p>
        La valeur est la somme des surfaces détaillées ci-dessus, qui ont été renseignées par
        l’utilisateur, pour le site et pour le projet.
      </p>
    </>
  );
};

export default PermeableSurfaceDescription;
