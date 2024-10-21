import { generateProjectName, ProjectInfo } from "./projectName";

describe("Project name generation", () => {
  it("should return 'Centrale photovoltaïque'", () => {
    const project: ProjectInfo = {
      developmentPlanCategory: "RENEWABLE_ENERGY",
      renewableEnergyType: "PHOTOVOLTAIC_POWER_PLANT",
    };

    expect(generateProjectName(project)).toEqual("Centrale photovoltaïque");
  });

  it("should return 'Projet agrivoltaïque'", () => {
    const project: ProjectInfo = {
      developmentPlanCategory: "RENEWABLE_ENERGY",
      renewableEnergyType: "AGRIVOLTAIC",
    };

    expect(generateProjectName(project)).toEqual("Projet agrivoltaïque");
  });

  it("should return 'Projet extension urbaine'", () => {
    const project: Omit<ProjectInfo, "renewableEnergyType"> = {
      developmentPlanCategory: "URBAN_PROJECT",
    };

    // @ts-expect-error renewableEnergyType is missing
    expect(generateProjectName(project)).toEqual("Projet quartier");
  });
});
