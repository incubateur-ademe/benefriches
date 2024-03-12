import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { ImpactCategoryFilter } from "../../project-impacts-page/ProjectImpactsPage";
import FilterButton from "./FilterButton";
import ProjectDurationSelect from "./ProjectDurationSelect";

type Props = {
  selectedFilter: ImpactCategoryFilter;
  onFilterClick: (filterValue: ImpactCategoryFilter) => void;
};

function ProjectsComparisonActionBar({ selectedFilter, onFilterClick }: Props) {
  return (
    <section
      className={fr.cx("fr-grid-row", "fr-py-2w", "fr-mb-1w")}
      style={{ justifyContent: "space-between", alignItems: "center" }}
    >
      <div className={fr.cx("fr-grid-row")} style={{ alignItems: "center" }}>
        <div className={fr.cx("fr-mr-2w")}>
          <FilterButton
            isActive={selectedFilter === "all"}
            onClick={() => {
              onFilterClick("all");
            }}
          >
            Tous
          </FilterButton>
        </div>
        <div className={fr.cx("fr-mr-2w")}>
          <FilterButton
            isActive={selectedFilter === "economic"}
            onClick={() => {
              onFilterClick("economic");
            }}
          >
            Économie
          </FilterButton>
        </div>
        <div className={fr.cx("fr-mr-2w")}>
          <FilterButton
            isActive={selectedFilter === "social"}
            onClick={() => {
              onFilterClick("social");
            }}
          >
            Social
          </FilterButton>
        </div>
        <div className={fr.cx("fr-mr-2w")}>
          <FilterButton
            isActive={selectedFilter === "environment"}
            onClick={() => {
              onFilterClick("environment");
            }}
          >
            Environnement
          </FilterButton>
        </div>
      </div>
      <div className={fr.cx("fr-grid-row", "fr-btns-group--between")}>
        <Button size="small" priority="secondary" className="fr-mr-2w">
          Vue graphiques
        </Button>
        <Button size="small" priority="secondary" className="fr-mr-2w">
          Vue liste
        </Button>
        <ProjectDurationSelect />
      </div>
    </section>
  );
}

export default ProjectsComparisonActionBar;
