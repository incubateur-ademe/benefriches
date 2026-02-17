import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
  EditorialPageButtonsSection,
} from "@/shared/views/layout/EditorialPageLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
  buildingsFootprintSurfaceArea: number;
  isUsesFlow?: boolean;
};

const BuildingsIntroduction = ({
  onNext,
  onBack,
  buildingsFootprintSurfaceArea,
  isUsesFlow,
}: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>🏢</EditorialPageIcon>
      <EditorialPageTitle>
        {isUsesFlow
          ? "Parlons maintenant des bâtiments."
          : "Nous allons maintenant parler des bâtiments qui composeront les lieux d'habitation et d'activité."}
      </EditorialPageTitle>
      {!isUsesFlow && (
        <>
          <EditorialPageText>
            Vous avez indiqué que les lieux d'habitation et d'activité comporteront{" "}
            <strong>{formatSurfaceArea(buildingsFootprintSurfaceArea)}</strong> de surface au sol de
            bâtiments.
          </EditorialPageText>
          <EditorialPageText>
            Dans les étapes suivantes, vous allez pouvoir renseigner les interventions que vous
            aurez sur les bâtiments, leurs surface de plancher, leurs usages, leurs équipements,
            etc.
          </EditorialPageText>
        </>
      )}
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
};

export default BuildingsIntroduction;
