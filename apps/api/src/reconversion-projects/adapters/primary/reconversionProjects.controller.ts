import { Body, Controller, Get, Post } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { z } from "zod";
import {
  CreateReconversionProjectUseCase,
  reconversionProjectPropsSchema,
} from "src/reconversion-projects/domain/usecases/createReconversionProject.usecase";
import { GetReconversionProjectsBySiteUseCase } from "src/reconversion-projects/domain/usecases/getReconversionProjectsBySite.usecase";

export type CreateReconversionProjectBodyDto = z.infer<typeof reconversionProjectPropsSchema>;

@Controller("reconversion-projects")
export class ReconversionProjectController {
  constructor(
    private readonly createReconversionProjectUseCase: CreateReconversionProjectUseCase,
    private readonly getReconversionProjectsBySite: GetReconversionProjectsBySiteUseCase,
  ) {}

  @Post()
  async createReconversionProject(
    @Body(new ZodValidationPipe(reconversionProjectPropsSchema))
    createReconversionProjectDto: CreateReconversionProjectBodyDto,
  ) {
    await this.createReconversionProjectUseCase.execute({
      reconversionProjectProps: createReconversionProjectDto,
    });
  }

  @Get("list-by-site")
  async getListGroupedBySite() {
    const result = await this.getReconversionProjectsBySite.execute();
    return result;
  }
}
