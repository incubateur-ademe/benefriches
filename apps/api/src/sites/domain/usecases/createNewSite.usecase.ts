import { UseCase } from "src/shared-kernel/usecase";
import { Site, sitePropsSchema } from "../models/site";

type Request = {
  siteProps: Site;
};

export interface SiteRepository {
  save(site: Site): Promise<void>;
  existsWithId(siteId: Site["id"]): Promise<boolean>;
}

export class CreateNewSiteUseCase implements UseCase<Request, void> {
  constructor(private readonly siteRepository: SiteRepository) {}

  async execute({ siteProps }: Request): Promise<void> {
    const parsedSite = await sitePropsSchema.parseAsync(siteProps);

    if (await this.siteRepository.existsWithId(parsedSite.id)) {
      throw new Error(`Site with id ${parsedSite.id} already exists`);
    }

    await this.siteRepository.save(parsedSite);
  }
}
