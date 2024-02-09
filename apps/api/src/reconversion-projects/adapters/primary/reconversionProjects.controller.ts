import { Body, Controller, Post } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { z } from "zod";
import {
  CreateReconversionProjectUseCase,
  reconversionProjectPropsSchema,
} from "src/reconversion-projects/domain/usecases/createReconversionProject.usecase";

export type CreateReconversionProjectBodyDto = z.infer<typeof reconversionProjectPropsSchema>;

@Controller("reconversion-projects")
export class ReconversionProjectController {
  constructor(
    private readonly createReconversionProjectUseCase: CreateReconversionProjectUseCase,
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
}
