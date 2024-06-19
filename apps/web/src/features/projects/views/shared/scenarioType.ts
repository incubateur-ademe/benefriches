export const getScenarioPictoUrl = (type: string) => {
  switch (type) {
    case "PHOTOVOLTAIC_POWER_PLANT":
      return "/img/pictograms/renewable-energy/photovoltaic.svg";
    case "MIXED_USE_NEIGHBOURHOOD":
      return "/img/pictograms/development-plans/mixed-used-neighborhood.svg";
    default:
      return undefined;
  }
};
