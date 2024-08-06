export type AppSettings = {
  shouldDisplayFormsNotice: boolean;
  shouldDisplayProjectsComparisonNotice: boolean;
  shouldDisplayMyProjectTourGuide?: boolean;
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  shouldDisplayFormsNotice: true,
  shouldDisplayProjectsComparisonNotice: true,
  shouldDisplayMyProjectTourGuide: true,
};
