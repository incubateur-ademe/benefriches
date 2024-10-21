import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
} from "@/shared/views/layout/EditorialPageLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
  buildingsFootprintSurfaceArea: number;
};

const BuildingsIntroduction = ({ onNext, onBack, buildingsFootprintSurfaceArea }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>🏢</EditorialPageIcon>
      <EditorialPageTitle>
        Nous allons maintenant parler des bâtiments qui composeront les lieux de vie et d'activité.
      </EditorialPageTitle>
      <EditorialPageText>
        Vous avez indiqué que les lieux de vie et d'activité comporteront{" "}
        <strong>{formatSurfaceArea(buildingsFootprintSurfaceArea)}</strong> de surface au sol de
        bâtiments.
      </EditorialPageText>
      <EditorialPageText>
        Dans les étapes suivantes, vous allez pouvoir renseigner les interventions que vous aurez
        sur les bâtiments, leurs surface de plancher, leurs usages, leurs équipements, etc.
      </EditorialPageText>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </EditorialPageLayout>
  );
};

export default BuildingsIntroduction;
