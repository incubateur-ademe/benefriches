// 12 500 m² pour 1000 kWc
export const PHOTOVOLTAIC_RATIO_M2_PER_KWC = 12.5;

export const AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS = 30;

const RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS = 0.88;
const RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS = 0.02;

export const getRecommendedPhotovoltaicPanelsAccessPathSurfaceArea = (
  photovoltaicInstallationElectricalPowerKWc: number,
) => {
  return photovoltaicInstallationElectricalPowerKWc * RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS;
};

export const getRecommendedPhotovoltaicPanelsFoundationsSurfaceArea = (
  photovoltaicInstallationElectricalPowerKWc: number,
) => {
  return photovoltaicInstallationElectricalPowerKWc * RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS;
};
