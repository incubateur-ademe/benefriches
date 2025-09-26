import { fr } from "@codegouvfr/react-dsfr";

import ButtonBadge from "@/shared/views/components/Badge/ButtonBadge";

export const PROJECT_AND_SITE_FEATURES_BADGE_DIALOG_ID = "project-and-site-features-badge-dialog";

const ExpressProjectTooltipBadge = () => {
  return (
    <ButtonBadge
      small
      className="my-2 shrink-1 sm:ml-3 py-0.5"
      color="blue"
      aria-controls={PROJECT_AND_SITE_FEATURES_BADGE_DIALOG_ID}
      data-fr-opened="false"
    >
      <span className="mr-1 whitespace-nowrap">Projet express</span>
      <span aria-hidden="true" className={fr.cx("fr-icon--sm", "fr-icon-information-line")} />
    </ButtonBadge>
  );
};

export default ExpressProjectTooltipBadge;
