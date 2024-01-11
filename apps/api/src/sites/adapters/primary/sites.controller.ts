import { Body, Controller, Post } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { z } from "zod";
import { sitePropsSchema } from "src/sites/domain/models/site";
import { CreateNewSiteUseCase } from "src/sites/domain/usecases/createNewSite.usecase";

type CreateSiteBodyDto = z.infer<typeof sitePropsSchema>;

@Controller("sites")
export class SitesController {
  constructor(private readonly createNewSiteUseCase: CreateNewSiteUseCase) {}

  @Post()
  async createNewSite(
    @Body(new ZodValidationPipe(sitePropsSchema)) createSiteDto: CreateSiteBodyDto,
  ) {
    console.log(createSiteDto);
    await this.createNewSiteUseCase.execute({ siteProps: createSiteDto });
  }
}
