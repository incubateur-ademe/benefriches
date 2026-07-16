export const makeWizardFormActionType = (prefix: string, actionName: string) => {
  return `${prefix}/wizardForm/${actionName}`;
};
