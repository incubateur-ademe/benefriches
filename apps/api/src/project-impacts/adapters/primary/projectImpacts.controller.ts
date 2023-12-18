import { Controller, Get, Param } from "@nestjs/common";
import { GetProjectPermeableSoilsImpactsUseCase } from "src/project-impacts/core/getProjectPermeableSoilsImpacts.usecase";

@Controller("project-impacts")
export class ProjectImpactsController {
  constructor(
    private readonly getProjectPermeableSoilsImpactUseCase: GetProjectPermeableSoilsImpactsUseCase,
  ) {}

  @Get("permeable-soils-surface/:projectId")
  async getProjectPermeableSoilsImpact(@Param("projectId") projectId: string) {
    const result = await this.getProjectPermeableSoilsImpactUseCase.execute({
      projectId,
    });

    return result;
  }
}
