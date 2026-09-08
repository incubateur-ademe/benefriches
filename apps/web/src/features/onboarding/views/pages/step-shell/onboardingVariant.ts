import { z } from "zod";

export const onboardingVariantSchema = z.enum(["evaluation-mutabilite", "evaluation-impacts"]);
export type OnboardingVariant = z.infer<typeof onboardingVariantSchema>;
