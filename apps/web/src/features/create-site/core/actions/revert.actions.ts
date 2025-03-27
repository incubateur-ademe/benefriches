import { SiteCreationData } from "../siteFoncier.types";
import { createSiteCreationAction } from "./actionsUtils";

type StepRevertedActionPayload = { resetFields: (keyof SiteCreationData)[] } | undefined;

export const stepRevertConfirmed =
  createSiteCreationAction<StepRevertedActionPayload>("stepRevertConfirmed");

export const stepRevertConfirmationResolved = createSiteCreationAction<{
  confirmed: boolean;
  doNotAskAgain: boolean;
}>("stepRevertConfirmationResolved");

export const stepRevertAttempted = createSiteCreationAction("stepRevertAttempted");
