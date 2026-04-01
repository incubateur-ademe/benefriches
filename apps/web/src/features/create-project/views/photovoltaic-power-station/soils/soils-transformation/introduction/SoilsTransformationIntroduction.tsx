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
};

const SoilsTransformationIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>🌾</EditorialPageIcon>
      <EditorialPageTitle>
        Nous allons maintenant parler de ce que seront les sols du site.
      </EditorialPageTitle>
      <EditorialPageText>
        Le site va accueillir des panneaux photovoltaïques, sous lesquels le sol peut être conservé
        en l’état ou être transformé.
        <br />
        Cela aura un impact direct sur la capacité d’absorption de l’eau et sur le pouvoir de
        stockage du carbone, il est donc important de bien renseigner cette partie.
      </EditorialPageText>
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
};

export default SoilsTransformationIntroduction;
