import { fr } from "@codegouvfr/react-dsfr";

import Badge from "@/shared/views/components/Badge/Badge";

import { projectAndSiteFeaturesModal } from "./impacts/project-and-site-features-modal/createProjectAndSiteFeaturesModal";

const ExpressProjectTooltipBadge = () => {
  return (
    <Badge
      small
      className="my-2 shrink-1 sm:ml-3 py-0.5 border-[#DEE5FD] hover:border-[#99B3F9] border border-solid hover:cursor-pointer"
      style="blue"
      onClick={() => {
        projectAndSiteFeaturesModal.open();
      }}
    >
      <span className="mr-1 whitespace-nowrap">Projet express</span>
      <span aria-hidden="true" className={fr.cx("fr-icon--sm", "fr-icon-information-line")} />
    </Badge>
  );
};

export default ExpressProjectTooltipBadge;
