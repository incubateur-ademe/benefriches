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
  isFriche: boolean;
};

const SiteSoilsIntroduction = ({ isFriche, onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>⛳️</EditorialPageIcon>
      <EditorialPageTitle>
        Parlons d'abord des sols qui existent sur {isFriche ? "la friche" : "le site"}
      </EditorialPageTitle>
      <EditorialPageText>
        Nous avons besoin de connaître leur typologie, leur occupation et les superficies
        correspondantes.
      </EditorialPageText>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </EditorialPageLayout>
  );
};

export default SiteSoilsIntroduction;
