import { generateProjectName } from "./projectName";

import { ProjectType, RenewableEnergyType } from "@/features/create-project/domain/project.types";

describe("Project name generation", () => {
  it("should return 'Projet photovoltaïque'", () => {
    const project = {
      id: "site-uuid-123",
      types: [ProjectType.RENEWABLE_ENERGY],
      renewableEnergyTypes: [RenewableEnergyType.PHOTOVOLTAIC],
    };

    expect(generateProjectName(project)).toEqual("Projet photovoltaïque");
  });

  it("should return 'Projet agrivoltaïque'", () => {
    const project = {
      id: "site-uuid-123",
      types: [ProjectType.RENEWABLE_ENERGY],
      renewableEnergyTypes: [RenewableEnergyType.AGRIVOLTAIC],
    };

    expect(generateProjectName(project)).toEqual("Projet agrivoltaïque");
  });

  it("should return 'Projet EnR mixte' when multiple renewable energy", () => {
    const project = {
      id: "site-uuid-123",
      types: [ProjectType.RENEWABLE_ENERGY],
      renewableEnergyTypes: [RenewableEnergyType.AGRIVOLTAIC, RenewableEnergyType.BIOMASS],
    };

    expect(generateProjectName(project)).toEqual("Projet EnR mixte");
  });

  it("should return 'Projet EnR mixte' when no renewable energy info", () => {
    const project = {
      id: "site-uuid-123",
      types: [ProjectType.RENEWABLE_ENERGY],
      renewableEnergyTypes: [],
    };

    expect(generateProjectName(project)).toEqual("Projet EnR mixte");
  });

  it("should return 'Projet extension urbaine'", () => {
    const project = {
      id: "site-uuid-123",
      types: [ProjectType.BUILDINGS],
      renewableEnergyTypes: [],
    };

    expect(generateProjectName(project)).toEqual(
      "Projet bâtiments, quartier mixte (habitations, commerces, infrastructures..)",
    );
  });

  it("should return 'Projet mixte' when multiple projects", () => {
    const project = {
      id: "site-uuid-123",
      types: [ProjectType.BUILDINGS, ProjectType.NATURAL_URBAN_SPACES],
      renewableEnergyTypes: [],
    };

    expect(generateProjectName(project)).toEqual("Projet mixte");
  });
});
