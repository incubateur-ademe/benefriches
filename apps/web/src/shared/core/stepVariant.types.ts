export type StepActivity = "current" | "groupActive" | "inactive";
export type StepValidation = "completed" | "empty";

export type StepVariant = {
  activity: StepActivity;
  validation: StepValidation;
};
