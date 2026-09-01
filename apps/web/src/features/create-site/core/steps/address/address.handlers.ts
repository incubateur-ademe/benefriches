import { isLocalAuthority } from "shared";

import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";
import type { StepInvalidationRule as GenericStepInvalidationRule } from "@/shared/core/wizard-form/stepHandler.type";

import type { CustomAnswerStepId } from "../../custom/customSteps";
import type { CustomAnswerStepHandler } from "../../custom/stepHandlerRegistry";

type StepInvalidationRule = GenericStepInvalidationRule<CustomAnswerStepId>;

export const addressHandlers = {
  ADDRESS: {
    stepId: "ADDRESS",
    getNextStepId: ({ context }) =>
      context.siteData.nature === "URBAN_ZONE"
        ? "URBAN_ZONE_LAND_PARCELS_INTRODUCTION"
        : "SPACES_INTRODUCTION",

    // Δ-gated on cityCode (not the whole Address, not banId): re-picking a different street in
    // the same city must NOT cascade — only a real city change does. Municipality data (owner /
    // tenant / operator local-authority choices) and soils carbon storage are both derived from
    // cityCode. Carbon storage is an INFO step with no stored answer, so it cannot be named by a
    // rule here — its staleness is instead guarded where it is fetched/rendered by tagging the
    // fetched slice with the cityCode it was computed for (see siteSoilsCarbonStorage.reducer.ts).
    // Only local-authority stakeholders are invalidated: a company or private-individual owner
    // isn't derived from the municipality and must survive an address change. Only steps the user
    // actually completed are invalidated, so a first-time address answer never surfaces an empty
    // confirmation dialog.
    getDependencyRules(params, answers) {
      const previousAddress = ReadStateHelper.getStepAnswers(params.answers, "ADDRESS")?.address;

      if (previousAddress?.cityCode === answers.address.cityCode) {
        return [];
      }

      const rules: StepInvalidationRule[] = [];

      const owner = ReadStateHelper.getStep(params.answers, "OWNER");
      if (
        owner?.completed &&
        owner.payload &&
        isLocalAuthority(owner.payload.owner.structureType)
      ) {
        rules.push({ stepId: "OWNER", action: "invalidate" });
      }

      const tenant = ReadStateHelper.getStep(params.answers, "TENANT");
      if (
        tenant?.completed &&
        tenant.payload?.tenant &&
        isLocalAuthority(tenant.payload.tenant.structureType)
      ) {
        rules.push({ stepId: "TENANT", action: "invalidate" });
      }

      const operator = ReadStateHelper.getStep(params.answers, "OPERATOR");
      if (
        operator?.completed &&
        operator.payload?.tenant &&
        isLocalAuthority(operator.payload.tenant.structureType)
      ) {
        rules.push({ stepId: "OPERATOR", action: "invalidate" });
      }

      return rules;
    },
  } satisfies CustomAnswerStepHandler<"ADDRESS">,
};
