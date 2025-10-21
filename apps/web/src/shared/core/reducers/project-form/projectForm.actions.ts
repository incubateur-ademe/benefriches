export const makeProjectFormActionType = (prefix: string, actionName: string) => {
  return `${prefix}/projectForm/${actionName}`;
};
