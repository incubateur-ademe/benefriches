export enum FricheActivity {
  AGRICULTURE = "AGRICULTURE",
  INDUSTRY = "INDUSTRY",
  MILITARY = "MILITARY",
  RAILWAY = "RAILWAY",
  PORT = "PORT",
  HOSPITAL = "HOSPITAL",
  ADMINISTRATION = "ADMINISTRATION",
  BUSINESS = "BUSINESS",
  HOUSING = "HOUSING",
}

export const getFricheActivityLabel = (fricheActivity: FricheActivity): string => {
  switch (fricheActivity) {
    case FricheActivity.AGRICULTURE:
      return "Friche agricole";
    case FricheActivity.INDUSTRY:
      return "Friche industrielle";
    case FricheActivity.MILITARY:
      return "Friche militaire";
    case FricheActivity.RAILWAY:
      return "Friche ferroviaire";
    case FricheActivity.PORT:
      return "Friche portuaire";
    case FricheActivity.HOSPITAL:
      return "Friche hospitalière";
    case FricheActivity.ADMINISTRATION:
      return "Friche administrative";
    case FricheActivity.BUSINESS:
      return "Friche commerciale";
    case FricheActivity.HOUSING:
      return "Friche d'habitat";
  }
};
