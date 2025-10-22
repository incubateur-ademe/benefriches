import { createProjectFormSelectors } from "@/shared/core/reducers/project-form/projectForm.selectors";
import { createUrbanProjectFormSelectors } from "@/shared/core/reducers/project-form/urban-project/urbanProject.selectors";

const { selectSiteAddress, selectSiteSoilsDistribution } =
  createProjectFormSelectors("projectUpdate");
export { selectSiteAddress, selectSiteSoilsDistribution };

const { selectProjectSoilDistribution } = createUrbanProjectFormSelectors("projectUpdate");
export { selectProjectSoilDistribution };
