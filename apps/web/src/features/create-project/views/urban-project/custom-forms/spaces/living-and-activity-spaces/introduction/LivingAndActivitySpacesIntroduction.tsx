import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
} from "@/shared/views/layout/EditorialPageLayout";

type Props = {
  livingAndActivitySpacesSurfaceArea: number;
  onNext: () => void;
  onBack: () => void;
};

const LivingAndActivitySpacesIntroduction = ({
  livingAndActivitySpacesSurfaceArea,
  onNext,
  onBack,
}: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>🏢</EditorialPageIcon>
      <EditorialPageTitle>Parlons des lieux de vie et d'activité.</EditorialPageTitle>
      <EditorialPageText>
        Votre projet d'aménagement comporte{" "}
        <strong>{formatSurfaceArea(livingAndActivitySpacesSurfaceArea)}</strong> de surface au sol
        de lieux de vie et d'activité.
        <br />
        Ces lieux peuvent contenir des bâtiments, mais aussi des des allées privées, des parkings
        privés ou encore des jardins privatifs ou partagés.
      </EditorialPageText>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </EditorialPageLayout>
  );
};

export default LivingAndActivitySpacesIntroduction;
