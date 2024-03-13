import { fr } from "@codegouvfr/react-dsfr";
import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import { ImpactCategoryFilter, ViewMode } from "../../project-impacts-page/ProjectImpactsPage";
import ProjectDurationSelect from "./ProjectDurationSelect";

type Props = {
  onFilterClick: (filterValue: ImpactCategoryFilter) => void;
  onViewModeClick: (viewMode: ViewMode) => void;
};

function ProjectsComparisonActionBar({ onFilterClick, onViewModeClick }: Props) {
  return (
    <section
      className={fr.cx("fr-grid-row", "fr-py-2w", "fr-mb-1w")}
      style={{ justifyContent: "space-between", alignItems: "center" }}
    >
      <div className={fr.cx("fr-grid-row")} style={{ alignItems: "center" }}>
        <SegmentedControl
          legend="Filtres"
          hideLegend
          segments={[
            {
              label: "Tous",
              nativeInputProps: {
                onClick: () => {
                  onFilterClick("all");
                },
              },
            },
            {
              label: "Économiques",
              nativeInputProps: {
                onClick: () => {
                  onFilterClick("economic");
                },
              },
            },
            {
              label: "Sociaux",
              nativeInputProps: {
                onClick: () => {
                  onFilterClick("social");
                },
              },
            },
            {
              label: "Environnementaux",
              nativeInputProps: {
                onClick: () => {
                  onFilterClick("environment");
                },
              },
            },
          ]}
        />
      </div>
      <div className={fr.cx("fr-grid-row", "fr-btns-group--between")}>
        <SegmentedControl
          legend="Filtres"
          className="fr-mr-3w"
          hideLegend
          segments={[
            {
              label: "Vue graphiques",
              nativeInputProps: {
                onClick: () => {
                  onViewModeClick("charts");
                },
              },
            },
            {
              label: "Vue liste",
              nativeInputProps: {
                onClick: () => {
                  onViewModeClick("list");
                },
              },
            },
          ]}
        />
        <ProjectDurationSelect />
      </div>
    </section>
  );
}

export default ProjectsComparisonActionBar;
