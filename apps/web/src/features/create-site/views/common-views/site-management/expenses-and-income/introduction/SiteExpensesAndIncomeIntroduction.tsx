import type { SiteNature } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
  EditorialPageButtonsSection,
} from "@/shared/views/layout/EditorialPageLayout";

type Props = {
  siteNature?: SiteNature;
  onNext: () => void;
  onBack: () => void;
};

const SiteExpensesAndIncomeIntroduction = ({ siteNature, onNext, onBack }: Props) => {
  switch (siteNature) {
    case "FRICHE":
      return (
        <EditorialPageLayout>
          <EditorialPageIcon>💸</EditorialPageIcon>
          <EditorialPageTitle>La friche engendre des dépenses</EditorialPageTitle>
          <EditorialPageText>Notamment de gestion et de sécurisation.</EditorialPageText>
          <EditorialPageButtonsSection>
            <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
          </EditorialPageButtonsSection>{" "}
        </EditorialPageLayout>
      );
    case "AGRICULTURAL_OPERATION":
      return (
        <EditorialPageLayout>
          <EditorialPageIcon>💰</EditorialPageIcon>
          <EditorialPageTitle>
            Cette exploitation agricole génère certainement des dépenses et des recettes.
          </EditorialPageTitle>
          <EditorialPageText>
            Voyons quels sont les montants liés à l’exploitation.
          </EditorialPageText>
          <EditorialPageButtonsSection>
            <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
          </EditorialPageButtonsSection>{" "}
        </EditorialPageLayout>
      );
    default:
      return null;
  }
};

export default SiteExpensesAndIncomeIntroduction;
