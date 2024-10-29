import { generateProjectName, ProjectInfo } from "./projectName";

describe("Project name generation", () => {
  it("should return 'Centrale photovoltaïque'", () => {
    const project: ProjectInfo = {
      renewableEnergyType: "PHOTOVOLTAIC_POWER_PLANT",
    };

    expect(generateProjectName("RENEWABLE_ENERGY", project)).toEqual("Centrale photovoltaïque");
  });

  it("should return 'Projet agrivoltaïque'", () => {
    const project: ProjectInfo = {
      renewableEnergyType: "AGRIVOLTAIC",
    };

    expect(generateProjectName("RENEWABLE_ENERGY", project)).toEqual("Projet agrivoltaïque");
  });

  it("should return 'Projet extension urbaine'", () => {
    // @ts-expect-error renewableEnergyType is missing
    expect(generateProjectName("URBAN_PROJECT")).toEqual("Projet quartier");
  });
});
