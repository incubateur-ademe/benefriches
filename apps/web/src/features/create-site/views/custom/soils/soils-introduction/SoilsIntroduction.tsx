import { SiteNature } from "shared";

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
  siteNature?: SiteNature;
};

const getTitle = (siteNature: SiteNature | undefined) => {
  const baseTitle = `Parlons d'abord des sols qui existent sur`;
  switch (siteNature) {
    case "FRICHE":
      return `${baseTitle} la friche`;
    case "AGRICULTURAL_OPERATION":
      return `${baseTitle} l'exploitation`;
    case "NATURAL_AREA":
      return `${baseTitle} l'espace naturel`;
    default:
      return `${baseTitle} le site`;
  }
};

const SiteSoilsIntroduction = ({ siteNature, onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>🌾</EditorialPageIcon>
      <EditorialPageTitle>{getTitle(siteNature)}</EditorialPageTitle>
      <EditorialPageText>
        Nous avons besoin de connaître les différentes espaces et leurs superficies.
      </EditorialPageText>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </EditorialPageLayout>
  );
};

export default SiteSoilsIntroduction;
