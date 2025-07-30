import { fr } from "@codegouvfr/react-dsfr";

import Badge from "@/shared/views/components/Badge/Badge";

import { projectFeaturesModal } from "./impacts/project-features-modal/createProjectFeaturesModal";

const ExpressProjectTooltipBadge = () => {
  return (
    <Badge
      small
      className="tw-my-2 tw-shrink-1 sm:tw-ml-3 tw-py-0.5 tw-border-[#DEE5FD] hover:tw-border-[#99B3F9] tw-border-1 tw-border-solid hover:tw-cursor-pointer"
      style="blue"
      onClick={() => {
        projectFeaturesModal.open();
      }}
    >
      <span className="tw-mr-1 tw-whitespace-nowrap">Projet express</span>
      <span aria-hidden="true" className={fr.cx("fr-icon--sm", "fr-icon-information-line")} />
    </Badge>
  );
};

export default ExpressProjectTooltipBadge;
