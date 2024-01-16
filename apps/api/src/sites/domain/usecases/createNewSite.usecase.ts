import { z } from "zod";
import { UseCase } from "src/shared-kernel/usecase";
import { fricheSchema, nonFricheSiteSchema, Site } from "../models/site";

// we can't use .omit method on siteSchema because zod doesn not allow it on discrimnated union
// see issue https://github.com/colinhacks/zod/issues/1768 and pending PR https://github.com/colinhacks/zod/pull/1589
const nonFrichePropsSchema = nonFricheSiteSchema.omit({ createdAt: true });
const frichePropsSchema = fricheSchema.omit({ createdAt: true });
export const sitePropsSchema = z.discriminatedUnion("isFriche", [
  nonFrichePropsSchema,
  frichePropsSchema,
]);

export type NonFricheSiteProps = z.infer<typeof nonFrichePropsSchema>;
export type FricheSiteProps = z.infer<typeof frichePropsSchema>;
export type SiteProps = z.infer<typeof sitePropsSchema>;

type Request = {
  siteProps: SiteProps;
};

export interface SiteRepository {
  save(site: Site): Promise<void>;
  existsWithId(siteId: Site["id"]): Promise<boolean>;
}

export interface DateProvider {
  now(): Date;
}

export class CreateNewSiteUseCase implements UseCase<Request, void> {
  constructor(
    private readonly siteRepository: SiteRepository,
    private readonly dateProvider: DateProvider,
  ) {}

  async execute({ siteProps }: Request): Promise<void> {
    const parsedSite = await sitePropsSchema.parseAsync(siteProps);

    if (await this.siteRepository.existsWithId(parsedSite.id)) {
      throw new Error(`Site with id ${parsedSite.id} already exists`);
    }

    const site: Site = {
      ...parsedSite,
      createdAt: this.dateProvider.now(),
    };

    await this.siteRepository.save(site);
  }
}
