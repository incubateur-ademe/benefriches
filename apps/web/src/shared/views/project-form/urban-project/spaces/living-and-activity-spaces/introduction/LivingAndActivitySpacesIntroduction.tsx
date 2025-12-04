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
      <EditorialPageTitle>Parlons des lieux d'habitation et d'activité.</EditorialPageTitle>
      <EditorialPageText>
        Votre projet d'aménagement comporte{" "}
        <strong>{formatSurfaceArea(livingAndActivitySpacesSurfaceArea)}</strong> de surface au sol
        de lieux d'habitation et d'activité.
        <br />
        Ces lieux peuvent contenir des bâtiments, mais aussi des des allées privées, des parkings
        privés ou encore des jardins privatifs ou partagés.
      </EditorialPageText>
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
};

export default LivingAndActivitySpacesIntroduction;
