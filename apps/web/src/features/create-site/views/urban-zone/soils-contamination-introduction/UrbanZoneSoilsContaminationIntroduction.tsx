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

const UrbanZoneSoilsContaminationIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>☣️</EditorialPageIcon>
      <EditorialPageTitle>Les sols de la zone urbaine sont peut-être pollués.</EditorialPageTitle>
      <EditorialPageText>
        <p>
          Cela peut être le cas s'il y a ou avait sur le site une station service ou un autre lieu
          d'activité polluante.
        </p>
        <p>
          Cela n'empêchera pas la réalisation du projet mais nécessitera des travaux de dépollution.
        </p>
      </EditorialPageText>
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
};

export default UrbanZoneSoilsContaminationIntroduction;
