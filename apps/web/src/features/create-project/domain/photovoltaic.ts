// 714 kWc pour 10000 m²
export const PHOTOVOLTAIC_RATIO_KWC_PER_M2 = 0.0714;

// 14 000 m² pour 1000 kWc
export const PHOTOVOLTAIC_RATIO_M2_PER_KWC = 14;

// Production annuelle en kWh/kWc en France
// https://www.hellowatt.fr/panneaux-solaires-photovoltaiques/production-panneaux-solaires
// TODO: Get real accurate value from localisation
// https://re.jrc.ec.europa.eu/pvg_tools/fr/tools.html
// https://www.monkitsolaire.fr/blog/kwh-et-kwc-comprendre-les-unites-de-mesure-en-autoconsommation-n400
export const AVERAGE_PHOTOVOLTAIC_ANNUAL_PRODUCTION_IN_KWH_BY_KWC_IN_FRANCE = 1100;

export const AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS = 30;

export const RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS = 0.88;
export const RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS = 0.02;
