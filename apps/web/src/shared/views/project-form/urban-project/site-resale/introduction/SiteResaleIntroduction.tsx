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

const SiteResaleIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>💰</EditorialPageIcon>
      <EditorialPageTitle>Le terrain peut faire l'objet d'une cession foncière.</EditorialPageTitle>
      <EditorialPageText>
        Tout ou partie du foncier peut être cédé à un ou plusieurs acteurs ou opérateurs (promoteur,
        bailleur social, collectivité...). <br />
        Voyons si cela fait partie de vos projets et dans quelle mesure.
      </EditorialPageText>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </EditorialPageLayout>
  );
};

export default SiteResaleIntroduction;
