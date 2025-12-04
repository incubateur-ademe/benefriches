import { SiteNature } from "shared";

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

const getTitle = (siteNature: SiteNature | undefined) => {
  const baseTitle = `Un ou plusieurs acteurs sont liés`;
  switch (siteNature) {
    case "FRICHE":
      return `${baseTitle} à la friche`;
    case "AGRICULTURAL_OPERATION":
      return `${baseTitle} à l'exploitation`;
    case "NATURAL_AREA":
      return `${baseTitle} à l'espace naturel`;
    default:
      return `${baseTitle} au site`;
  }
};

const SiteManagementIntroduction = ({ siteNature, onNext, onBack }: Props) => {
  const title = getTitle(siteNature);
  const text =
    siteNature === "FRICHE"
      ? "Nous avons besoin de les connaître pour savoir à qui seront imputables les différentes dépenses liés à la friche."
      : "Nous avons besoin de les connaître pour savoir qui prend à sa charge les dépenses et touche les éventuelles recettes d'exploitation.";
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>🧑‍💼</EditorialPageIcon>
      <EditorialPageTitle>{title}</EditorialPageTitle>
      <EditorialPageText>{text} </EditorialPageText>
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>{" "}
    </EditorialPageLayout>
  );
};

export default SiteManagementIntroduction;
