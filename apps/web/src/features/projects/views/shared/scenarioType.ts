export const getScenarioPictoUrl = (type: string) => {
  switch (type) {
    case "PHOTOVOLTAIC_POWER_PLANT":
      return "/img/pictograms/renewable-energy/photovoltaic.svg";
    case "URBAN_PROJECT":
      return "/img/pictograms/development-plans/urban-project.svg";
    default:
      return undefined;
  }
};
