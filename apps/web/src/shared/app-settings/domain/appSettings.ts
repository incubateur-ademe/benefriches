export type AppSettings = {
  shouldDisplayFormsNotice: boolean;
  shouldDisplayProjectsComparisonNotice: boolean;
  shouldDisplayImpactsNotice: boolean;
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  shouldDisplayFormsNotice: true,
  shouldDisplayProjectsComparisonNotice: true,
  shouldDisplayImpactsNotice: true,
};
