import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { Menu, MenuButton, MenuItems, MenuSeparator } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import type { Link } from "type-route";

import ArchiveProjectDialog from "@/features/archive-project/views/ArchiveProjectDialog";
import type { ProjectDevelopmentPlanType } from "@/features/projects/core/projects.types";
import type { ClassValue } from "@/shared/views/clsx";
import classNames from "@/shared/views/clsx";
import MenuItemButton from "@/shared/views/components/Menu/MenuItemButton";
import { MENU_ITEMS_CLASSES } from "@/shared/views/components/Menu/classes";
import { getScenarioPictoUrl } from "@/shared/views/components/ProjectTile/scenarioType";
import { useIsSmallScreen } from "@/shared/views/hooks/useIsSmallScreen";

import ExpressProjectTooltipBadge from "../../shared/project-badge/ExpressProjectBadge";
import ExportImpactsModal from "../export-impacts-modal/ExportModal";
import { exportImpactsModal } from "../export-impacts-modal/createExportModal";

export type HeaderProps = {
  projectName: string;
  siteFeaturesHref: string;
  siteName: string;
  projectType?: ProjectDevelopmentPlanType;
  isExpressProject: boolean;
  size?: "small" | "medium";
  className?: ClassValue;
  onDuplicateProject: () => void;
  onSuccessArchiveProject: () => void;
  onExportModalOpened: () => void;
  projectId: string;
  siteId: string;
  updateProjectLinkProps: Link;
  createProjectLinkProps: Link;
  documentationLinkProps: Link;
  noMenu?: boolean;
};

const ProjectPageHeader = ({
  projectName,
  siteName,
  siteFeaturesHref,
  projectType,
  isExpressProject,
  size: propsSize,
  className,
  updateProjectLinkProps,
  createProjectLinkProps,
  documentationLinkProps,
  onDuplicateProject,
  onSuccessArchiveProject,
  onExportModalOpened,
  projectId,
  siteId,
  noMenu,
}: HeaderProps) => {
  const isSmallScreen = useIsSmallScreen();
  const size = propsSize ?? (isSmallScreen ? "small" : "medium");
  const isSmallSize = size === "small";

  const hasUpdateFeature =
    !isExpressProject &&
    (projectType === "URBAN_PROJECT" || projectType === "PHOTOVOLTAIC_POWER_PLANT");

  return (
    <div
      className={classNames(
        "grid",
        "grid-cols-[60px_1fr_1fr]",
        "md:grid-cols-[72px_1fr_1fr]",
        "gap-x-2 md:gap-x-3",
        "items-center",
        "justify-center",
        className,
      )}
    >
      {projectType && (
        <img
          className={classNames(
            "col-start-1",
            "sm:row-start-1 sm:row-span-2",
            isSmallSize ? "w-15 h-15" : "md:w-18 md:h-18",
          )}
          src={getScenarioPictoUrl(projectType)}
          aria-hidden={true}
          alt=""
          width="60"
          height="60"
        />
      )}

      <div className="col-start-2 sm:inline-flex items-center">
        <h2 className={classNames("my-0", isSmallSize && "text-2xl")}>{projectName}</h2>
        {isExpressProject && !isSmallScreen && <ExpressProjectTooltipBadge />}
      </div>
      <div
        className={classNames(
          "row-start-2",
          "col-start-1 sm:col-start-2",
          "col-span-2 sm:col-span-1",
        )}
      >
        <span
          className={fr.cx(
            "fr-icon-map-pin-2-line",
            "fr-icon--sm",
            isSmallSize ? "fr-mr-1w" : "fr-mr-0-5v",
          )}
          aria-hidden="true"
        ></span>
        <a
          href={siteFeaturesHref}
          className="text-base hover:underline"
          style={{ backgroundImage: "none" }} // DSFR applies a background image for underline style by default
        >
          {siteName}
        </a>
      </div>

      <div className="md:col-start-3 md:row-span-3 flex gap-1 items-center justify-end">
        {!isSmallSize ? (
          <Button
            priority="primary"
            iconId="fr-icon-file-download-line"
            onClick={() => {
              onExportModalOpened();
              exportImpactsModal.open();
            }}
          >
            Télécharger les impacts
          </Button>
        ) : (
          <Button
            priority="primary"
            iconId="fr-icon-file-download-line"
            title="Télécharger les impacts"
            onClick={() => {
              onExportModalOpened();
              exportImpactsModal.open();
            }}
          />
        )}
        {!noMenu && (
          <>
            <Menu>
              <MenuButton as={Fragment}>
                <Button
                  priority="secondary"
                  iconId="fr-icon-more-fill"
                  title="Voir plus de fonctionnalités"
                />
              </MenuButton>
              <MenuItems
                anchor="bottom end"
                transition
                className={classNames("z-40", "w-80", MENU_ITEMS_CLASSES)}
              >
                {hasUpdateFeature && (
                  <>
                    <MenuItemButton iconId="fr-icon-edit-line" linkProps={updateProjectLinkProps}>
                      Modifier les caractéristiques du projet
                    </MenuItemButton>
                    <MenuSeparator className="my-1 h-px bg-border-grey mx-3" />
                    <MenuItemButton iconId="ri-file-copy-line" onClick={onDuplicateProject}>
                      Évaluer une variante du projet
                    </MenuItemButton>
                  </>
                )}
                <MenuItemButton iconId="fr-icon-file-add-line" linkProps={createProjectLinkProps}>
                  Évaluer un nouveau projet
                </MenuItemButton>

                <MenuItemButton iconId="ri-file-marked-line" linkProps={documentationLinkProps}>
                  Comprendre la méthodologie
                </MenuItemButton>

                <MenuItemButton
                  iconId="fr-icon-delete-line"
                  className="text-error-ultradark"
                  nativeButtonProps={{
                    "aria-controls": `archive-project-${projectId}`,
                    "data-fr-opened": true,
                  }}
                >
                  Supprimer le projet
                </MenuItemButton>
              </MenuItems>
            </Menu>
            <ArchiveProjectDialog
              dialogId={`archive-project-${projectId}`}
              projectId={projectId}
              projectName={projectName}
              onSuccess={onSuccessArchiveProject}
            />
          </>
        )}

        <ExportImpactsModal projectId={projectId} siteId={siteId} />
      </div>
    </div>
  );
};

export default ProjectPageHeader;
