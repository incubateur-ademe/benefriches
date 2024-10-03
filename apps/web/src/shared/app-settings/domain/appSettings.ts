export type AppSettings = {
  shouldDisplayProjectsComparisonNotice: boolean;
  shouldDisplayMyProjectTourGuide?: boolean;
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  shouldDisplayProjectsComparisonNotice: true,
  shouldDisplayMyProjectTourGuide: true,
};
