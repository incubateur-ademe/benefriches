import { generateUrbanProjectName, generateRenewableEnergyProjectName } from "./projectName";

describe("Project name generation", () => {
  it("should return 'Centrale photovoltaïque'", () => {
    expect(generateRenewableEnergyProjectName("PHOTOVOLTAIC_POWER_PLANT")).toEqual(
      "Centrale photovoltaïque",
    );
  });

  it("should return 'Projet agrivoltaïque'", () => {
    expect(generateRenewableEnergyProjectName("AGRIVOLTAIC")).toEqual("Projet agrivoltaïque");
  });

  it("should return 'Projet extension urbaine'", () => {
    expect(generateUrbanProjectName()).toEqual("Projet urbain mixte");
  });
});
