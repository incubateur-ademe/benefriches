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

const UrbanSpacesDevelopmentPlanIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>🌾</EditorialPageIcon>
      <EditorialPageTitle>
        Nous allons maintenant parler de comment vont être aménagés les espaces du site
      </EditorialPageTitle>
      <EditorialPageText>
        Les différentes fonctions urbaines et l'implantation de votre projet peuvent avoir des
        conséquences sur l'usage des sols du site.
        <br />
        Cela aura un impact direct, notamment sur la capacité d'absorption de l'eau et sur le
        pouvoir de stockage du carbone, il est donc important de bien renseigner cette partie.
      </EditorialPageText>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </EditorialPageLayout>
  );
};

export default UrbanSpacesDevelopmentPlanIntroduction;
