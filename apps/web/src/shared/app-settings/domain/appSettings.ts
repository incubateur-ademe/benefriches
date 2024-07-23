export type AppSettings = {
  shouldDisplayFormsNotice: boolean;
  shouldDisplayProjectsComparisonNotice: boolean;
  shouldDisplayImpactsNotice: boolean;
  shouldDisplayMyProjectTourGuide?: boolean;
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  shouldDisplayFormsNotice: true,
  shouldDisplayProjectsComparisonNotice: true,
  shouldDisplayImpactsNotice: true,
  shouldDisplayMyProjectTourGuide: true,
};
