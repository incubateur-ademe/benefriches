// Express urban project templates (subset of all UrbanProjectTemplate values)
export type ExpressUrbanProjectTemplate =
  | "NEW_URBAN_CENTER"
  | "PUBLIC_FACILITIES"
  | "RESIDENTIAL_NORMAL_AREA"
  | "RESIDENTIAL_TENSE_AREA";

export const getLabelForUrbanProjectCategory = (category: ExpressUrbanProjectTemplate): string => {
  switch (category) {
    case "NEW_URBAN_CENTER":
      return "Centralité urbaine";
    case "PUBLIC_FACILITIES":
      return "Équipement public";
    case "RESIDENTIAL_NORMAL_AREA":
      return "Résidentiel secteur détendu";
    case "RESIDENTIAL_TENSE_AREA":
      return "Résidentiel secteur tendu";
  }
};
