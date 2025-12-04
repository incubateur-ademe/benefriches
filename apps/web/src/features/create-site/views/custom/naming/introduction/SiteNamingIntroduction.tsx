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

const SiteNamingIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>✍️</EditorialPageIcon>
      <EditorialPageTitle>Quelle est l'identité de ce site ?</EditorialPageTitle>
      <EditorialPageText>
        Dernières questions avant de pouvoir renseigner votre projet !
      </EditorialPageText>
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>{" "}
    </EditorialPageLayout>
  );
};

export default SiteNamingIntroduction;
