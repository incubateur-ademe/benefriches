import { z } from "zod";

import { UseCase } from "src/shared-kernel/usecase";

export interface UserFeatureAlertRepository {
  save(props: UserFeatureAlert): Promise<void>;
}

export interface DateProvider {
  now(): Date;
}

export type UserFeatureAlert = z.infer<typeof createFeatureAlertSchema>;

const baseFeatureAlertSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  email: z.string().email(),
  createdAt: z.date(),
});

const createFeatureAlertSchema = z.discriminatedUnion("featureType", [
  baseFeatureAlertSchema.extend({
    featureType: z.literal("export_impacts"),
    featureOptions: z.object({
      pdf: z.boolean(),
      excel: z.boolean(),
      sharing_link: z.boolean(),
    }),
  }),
  baseFeatureAlertSchema.extend({
    featureType: z.literal("compare_impacts"),
    featureOptions: z.object({
      same_project_on_other_site: z.boolean(),
      other_project_on_same_site: z.boolean(),
      statu_quo_scenario: z.boolean(),
    }),
  }),
  baseFeatureAlertSchema.extend({
    featureType: z.literal("duplicate_project"),
  }),
]);

export const createFeatureAlertProps = baseFeatureAlertSchema.omit({ createdAt: true }).extend({
  feature: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("export_impacts"),
      options: z.array(z.enum(["pdf", "excel", "sharing_link"])).optional(),
    }),
    z.object({
      type: z.literal("duplicate_project"),
    }),
    z.object({
      type: z.literal("compare_impacts"),
      options: z
        .array(
          z.enum([
            "same_project_on_other_site",
            "other_project_on_same_site",
            "statu_quo_scenario",
          ]),
        )
        .optional(),
    }),
  ]),
});

export type Request = z.infer<typeof createFeatureAlertProps>;

const convertArrayOptionsToObject = (feature: Request["feature"]) => {
  switch (feature.type) {
    case "compare_impacts":
      return {
        same_project_on_other_site:
          feature.options?.some((option) => option === "same_project_on_other_site") ?? false,
        other_project_on_same_site:
          feature.options?.some((option) => option === "other_project_on_same_site") ?? false,
        statu_quo_scenario:
          feature.options?.some((option) => option === "statu_quo_scenario") ?? false,
      };
    case "duplicate_project":
      return undefined;
    case "export_impacts":
      return {
        pdf: feature.options?.some((option) => option === "pdf") ?? false,
        excel: feature.options?.some((option) => option === "excel") ?? false,
        sharing_link: feature.options?.some((option) => option === "sharing_link") ?? false,
      };
  }
};

export class CreateUserFeatureAlertUseCase implements UseCase<Request, void> {
  constructor(
    private readonly userFeatureAlertRepository: UserFeatureAlertRepository,
    private readonly dateProvider: DateProvider,
  ) {}

  async execute(props: Request): Promise<void> {
    const { userId, email, feature, id } = await createFeatureAlertProps.parseAsync(props);

    const repositoryProps = await createFeatureAlertSchema.parseAsync({
      id,
      userId,
      email,
      featureType: feature.type,
      featureOptions: convertArrayOptionsToObject(feature),
      createdAt: this.dateProvider.now(),
    });

    await this.userFeatureAlertRepository.save(repositoryProps);
  }
}
