import { fr } from "@codegouvfr/react-dsfr";
import FilterButton from "./FilterButton";
import ProjectDurationSelect from "./ProjectDurationSelect";
import SearchInput from "./SearchInput";

type Props = {
  selectedFilter: "all" | "monetary";
  onMonetaryFilterClick: () => void;
  onAllFilterClick: () => void;
};

function ProjectsComparisonActionBar({
  selectedFilter,
  onMonetaryFilterClick,
  onAllFilterClick,
}: Props) {
  return (
    <section
      className={fr.cx("fr-grid-row", "fr-py-2w", "fr-mb-1w")}
      style={{ justifyContent: "space-between", alignItems: "center" }}
    >
      <div
        className={fr.cx("fr-grid-row", "fr-btns-group--between")}
        style={{ alignItems: "center" }}
      >
        <div className={fr.cx("fr-mr-2w")}>
          <SearchInput />
        </div>
        <div className={fr.cx("fr-mr-2w")}>
          <FilterButton
            isActive={selectedFilter === "all"}
            onClick={onAllFilterClick}
          >
            Tous les indicateurs
          </FilterButton>
        </div>
        <FilterButton
          isActive={selectedFilter === "monetary"}
          onClick={onMonetaryFilterClick}
        >
          Indicateurs monétaires uniquement
        </FilterButton>
      </div>
      <ProjectDurationSelect />
    </section>
  );
}

export default ProjectsComparisonActionBar;
