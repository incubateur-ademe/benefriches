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
};

const UrbanProjectSpacesIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>🏘️</EditorialPageIcon>
      <EditorialPageTitle>
        Commençons par parler des espaces qui composeront le projet urbain.
      </EditorialPageTitle>
      <EditorialPageText>
        Ceux-ci peuvent être des lieux d'habitation et d'activité (en particulier des bâtiments),
        des espaces verts, des espaces publics, mais aussi une ferme urbaine, une centrale de
        production d'énergie renouvelable ou encore un plan d'eau.
      </EditorialPageText>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </EditorialPageLayout>
  );
};

export default UrbanProjectSpacesIntroduction;
