import { generateProjectName, ProjectInfo } from "./projectName";

describe("Project name generation", () => {
  it("should return 'Projet photovoltaïque'", () => {
    const project: ProjectInfo = {
      developmentPlanCategories: ["RENEWABLE_ENERGY"],
      renewableEnergyTypes: ["PHOTOVOLTAIC_POWER_PLANT"],
    };

    expect(generateProjectName(project)).toEqual("Projet photovoltaïque");
  });

  it("should return 'Projet agrivoltaïque'", () => {
    const project: ProjectInfo = {
      developmentPlanCategories: ["RENEWABLE_ENERGY"],
      renewableEnergyTypes: ["AGRIVOLTAIC"],
    };

    expect(generateProjectName(project)).toEqual("Projet agrivoltaïque");
  });

  it("should return 'Projet EnR mixte' when multiple renewable energy", () => {
    const project: ProjectInfo = {
      developmentPlanCategories: ["RENEWABLE_ENERGY"],
      renewableEnergyTypes: ["AGRIVOLTAIC", "BIOMASS"],
    };

    expect(generateProjectName(project)).toEqual("Projet EnR mixte");
  });

  it("should return 'Projet EnR mixte' when no renewable energy info", () => {
    const project: ProjectInfo = {
      developmentPlanCategories: ["RENEWABLE_ENERGY"],
      renewableEnergyTypes: [],
    };

    expect(generateProjectName(project)).toEqual("Projet EnR mixte");
  });

  it("should return 'Projet extension urbaine'", () => {
    const project: ProjectInfo = {
      developmentPlanCategories: ["BUILDINGS"],
      renewableEnergyTypes: [],
    };

    expect(generateProjectName(project)).toEqual(
      "Projet bâtiments, quartier mixte (habitations, commerces, infrastructures..)",
    );
  });

  it("should return 'Projet mixte' when multiple projects", () => {
    const project: ProjectInfo = {
      developmentPlanCategories: ["BUILDINGS", "NATURAL_URBAN_SPACES"],
      renewableEnergyTypes: [],
    };

    expect(generateProjectName(project)).toEqual("Projet mixte");
  });
});
