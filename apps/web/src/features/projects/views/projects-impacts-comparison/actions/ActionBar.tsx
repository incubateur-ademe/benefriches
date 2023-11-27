import { useState } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import FilterButton from "./FilterButton";
import ProjectDurationSelect from "./ProjectDurationSelect";
import SearchInput from "./SearchInput";

function ProjectsComparisonActionBar() {
  const [filterState, setFilterState] = useState<"all" | "monetary">("all");

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
            isActive={filterState === "all"}
            onClick={() => setFilterState("all")}
          >
            Tous les indicateurs
          </FilterButton>
        </div>
        <FilterButton
          isActive={filterState === "monetary"}
          onClick={() => setFilterState("monetary")}
        >
          Indicateurs monétaires uniquement
        </FilterButton>
      </div>
      <ProjectDurationSelect />
    </section>
  );
}

export default ProjectsComparisonActionBar;
