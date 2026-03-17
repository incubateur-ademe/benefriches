import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import {
  EditorialPageButtonsSection,
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
} from "@/shared/views/layout/EditorialPageLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const UrbanZoneExpensesAndIncomeIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>💰</EditorialPageIcon>
      <EditorialPageTitle>
        Cette zone commerciale génère certainement des dépenses et des recettes.
      </EditorialPageTitle>
      <EditorialPageText>
        Voyons quels sont les montants liés à la gestion du site.
      </EditorialPageText>
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
};

export default UrbanZoneExpensesAndIncomeIntroduction;
