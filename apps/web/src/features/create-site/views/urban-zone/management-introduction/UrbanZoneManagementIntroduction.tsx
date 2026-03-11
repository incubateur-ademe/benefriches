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

const UrbanZoneManagementIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>💼</EditorialPageIcon>
      <EditorialPageTitle>Parlons de la gestion et de l'activité du site.</EditorialPageTitle>
      <EditorialPageText>
        <p>
          Nous avons besoin de savoir qui gère et exploite la zone commerciale, ainsi que le nombre
          d'emplois.
        </p>
      </EditorialPageText>
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
};

export default UrbanZoneManagementIntroduction;
