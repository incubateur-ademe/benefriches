import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
} from "@/shared/views/layout/EditorialPageLayout";

import { open } from "./modal";
import ClimateAndBiodiversityInformationModal from "./modal/ClimateAndBiodiversityInformationModal";

const PositiveImpactTitleAndIcon = () => {
  return (
    <>
      <EditorialPageIcon>👏</EditorialPageIcon>
      <EditorialPageTitle>
        Bonne nouvelle, votre projet est favorable au climat, au cycle de l'eau et à la biodiversité
        !
      </EditorialPageTitle>
    </>
  );
};

const NegativeImpactTitleAndIcon = () => {
  return (
    <>
      <EditorialPageIcon>🚨</EditorialPageIcon>
      <EditorialPageTitle>
        Attention, votre projet pourrait nuire au climat, au cycle de l'eau et à la biodiversité
      </EditorialPageTitle>
    </>
  );
};

type Props = {
  onBack: () => void;
  onNext: () => void;
  hasTransformationNegativeImpact: boolean;
  sensibleSurfaceAreaDestroyed: number;
  futureBiodiversityAndClimateSensitiveSoilsSurfaceArea: number;
};

export default function ClimateAndBiodiversityImpactNotice({
  onBack,
  onNext,
  hasTransformationNegativeImpact,
  sensibleSurfaceAreaDestroyed,
  futureBiodiversityAndClimateSensitiveSoilsSurfaceArea,
}: Props) {
  return (
    <EditorialPageLayout>
      {hasTransformationNegativeImpact ? (
        <>
          <NegativeImpactTitleAndIcon />
          <EditorialPageText>
            Vous envisagez de détruire {formatSurfaceArea(sensibleSurfaceAreaDestroyed)} de forêt ou
            de zone humide.
          </EditorialPageText>
        </>
      ) : (
        <>
          <PositiveImpactTitleAndIcon />
          <EditorialPageText>
            Vous allez sanctuariser{" "}
            {formatSurfaceArea(futureBiodiversityAndClimateSensitiveSoilsSurfaceArea)} de forêt ou
            de zone humide.
          </EditorialPageText>
        </>
      )}
      <EditorialPageText>
        Forêts, prairies arborées et zones humides sont des espaces essentiels à la biodiversité et
        assurent de nombreux services pour l'Homme : atténuation du changement climatique par
        absorption du CO2, régulation de la qualité de l'eau, contribution aux cycles de l'eau et de
        l'azote, etc.&nbsp;
        <span
          role="button"
          className="tw-cursor-pointer tw-underline"
          onClick={() => {
            open();
          }}
        >
          En savoir plus
        </span>
      </EditorialPageText>
      {hasTransformationNegativeImpact && (
        <EditorialPageText>
          Pour éviter ces dommages environnementaux, vous pouvez retourner dans les étapes
          précédentes et modifier les paramètres de votre projet.
          <br />
          Si vous souhaitez continer le projet en l'état, cliquez sur suivant.
        </EditorialPageText>
      )}
      <ClimateAndBiodiversityInformationModal />
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </EditorialPageLayout>
  );
}
