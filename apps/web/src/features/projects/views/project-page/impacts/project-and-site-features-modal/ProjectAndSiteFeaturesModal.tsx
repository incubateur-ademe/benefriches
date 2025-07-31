import Button from "@codegouvfr/react-dsfr/Button";
import { useState } from "react";

import { ProjectFeatures } from "@/features/projects/domain/projects.types";
import { SiteFeatures } from "@/features/site-features/core/siteFeatures";
import SiteFeaturesList from "@/features/site-features/views/SiteFeaturesList";
import classNames from "@/shared/views/clsx";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import ProjectFeaturesView from "../../features/ProjectFeaturesView";
import { projectAndSiteFeaturesModal } from "./createProjectAndSiteFeaturesModal";

type AccordionProps = {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  isOpen: boolean;
};

function Accordion({ onClick, isOpen, label, children }: AccordionProps) {
  return (
    <div>
      <div
        className={classNames(
          "tw-py-2 tw-px-4 tw-mb-4",
          "tw-rounded tw-border tw-border-solid tw-border-transparent",
          "tw-bg-impacts-main dark:tw-bg-black",
          "tw-cursor-pointer",
          "tw-transition tw-ease-in-out tw-duration-500",
          "hover:tw-border-grey-dark hover:dark:tw-border-white",
          "tw-flex tw-items-center tw-gap-2",
        )}
        onClick={onClick}
      >
        <Button
          className={classNames("tw-text-black dark:tw-text-white")}
          iconId={isOpen ? "fr-icon-arrow-up-s-fill" : "fr-icon-arrow-down-s-fill"}
          onClick={onClick}
          size="small"
          priority="tertiary no outline"
          title={isOpen ? "Fermer la section" : "Afficher la section"}
        />
        <h2 className="tw-text-lg tw-mb-0">{label}</h2>
      </div>
      {isOpen && <div className="tw-px-4">{children}</div>}
    </div>
  );
}

type Props = {
  projectFeaturesData?: ProjectFeatures;
  siteFeaturesData?: SiteFeatures;
  isOpen: boolean;
};

const ProjectAndSiteFeaturesModal = ({ projectFeaturesData, siteFeaturesData, isOpen }: Props) => {
  const [isProjectFeaturesOpen, setProjectFeaturesOpen] = useState(true);
  const [isSiteFeaturesOpen, setSiteFeaturesOpen] = useState(true);

  const toggleProjectFeatures = () => {
    setProjectFeaturesOpen((prev) => !prev);
  };
  const toggleSiteFeatures = () => {
    setSiteFeaturesOpen((prev) => !prev);
  };

  return (
    <projectAndSiteFeaturesModal.Component title="Données du site et du projet" size="large">
      {!isOpen ? null : projectFeaturesData && siteFeaturesData ? (
        <div>
          <Accordion
            label={`Données du site "${siteFeaturesData.name}"`}
            isOpen={isSiteFeaturesOpen}
            onClick={toggleSiteFeatures}
          >
            <SiteFeaturesList {...siteFeaturesData} />
          </Accordion>
          <Accordion
            label={`Données du projet "${projectFeaturesData.name}"`}
            isOpen={isProjectFeaturesOpen}
            onClick={toggleProjectFeatures}
          >
            <ProjectFeaturesView projectData={projectFeaturesData} />
          </Accordion>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </projectAndSiteFeaturesModal.Component>
  );
};

export default ProjectAndSiteFeaturesModal;
