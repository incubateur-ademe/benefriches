import type { ReactNode } from "react";
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
  onNext: () => void;
  onBack: () => void;
  siteNature?: SiteNature;
};

const getTitle = (siteNature: SiteNature | undefined) => {
  const baseTitle = `Parlons d'abord des espaces qui existent actuellement sur`;
  switch (siteNature) {
    case "FRICHE":
      return `${baseTitle} la friche.`;
    case "AGRICULTURAL_OPERATION":
      return `${baseTitle} l'exploitation.`;
    case "NATURAL_AREA":
      return `${baseTitle} l'espace naturel.`;
    default:
      return `${baseTitle} le site.`;
  }
};

const getText = (siteNature: SiteNature | undefined): ReactNode => {
  const baseText = "Nous avons besoin de connaître les différentes espaces et leurs superficies.";
  switch (siteNature) {
    case "FRICHE":
      return (
        <>
          <span>Bâtiments, aire bitumée ou gravillonnée, pelouse...</span>
          <br />
          <span>{baseText}</span>
        </>
      );
    case "AGRICULTURAL_OPERATION":
      return (
        <>
          <span>Cultures prairies, bâtiments...</span>
          <br />
          <span>{baseText}</span>
        </>
      );
    case "NATURAL_AREA":
      return (
        <>
          <span>Arbres, espaces minéraux...</span>
          <br />
          <span>{baseText}</span>
        </>
      );
    default:
      return baseText;
  }
};

const SiteSpacesIntroduction = ({ siteNature, onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>🌾</EditorialPageIcon>
      <EditorialPageTitle>{getTitle(siteNature)}</EditorialPageTitle>
      <EditorialPageText>{getText(siteNature)}</EditorialPageText>
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
};

export default SiteSpacesIntroduction;
