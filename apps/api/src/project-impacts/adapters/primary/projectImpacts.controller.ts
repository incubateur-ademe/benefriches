import { Controller, Get, Param } from "@nestjs/common";
import { GetProjectContaminatedSoilsImpactUseCase } from "src/project-impacts/core/getProjectContaminatedSoilsImpact.usecase";
import { GetProjectPermeableSoilsImpactsUseCase } from "src/project-impacts/core/getProjectPermeableSoilsImpacts.usecase";

@Controller("project-impacts")
export class ProjectImpactsController {
  constructor(
    private readonly getProjectPermeableSoilsImpactUseCase: GetProjectPermeableSoilsImpactsUseCase,
    private readonly getProjectContaminatedSoilsImpactUseCase: GetProjectContaminatedSoilsImpactUseCase,
  ) {}

  @Get("permeable-soils-surface/:projectId")
  async getProjectPermeableSoilsImpact(@Param("projectId") projectId: string) {
    const result = await this.getProjectPermeableSoilsImpactUseCase.execute({
      projectId,
    });

    return result;
  }

  @Get("contaminated-soils-surface/:projectId")
  async getProjectContaminatedSoilsImpact(
    @Param("projectId") projectId: string,
  ) {
    const result = await this.getProjectContaminatedSoilsImpactUseCase.execute({
      projectId,
    });

    return result;
  }
}
