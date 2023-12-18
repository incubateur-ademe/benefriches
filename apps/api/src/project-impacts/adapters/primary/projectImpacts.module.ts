import { Module } from "@nestjs/common";
import {
  GetProjectContaminatedSoilsImpactUseCase,
  ProjectRepository as ContaminatedSoilProjectRepository,
} from "src/project-impacts/core/getProjectContaminatedSoilsImpact.usecase";
import {
  GetProjectPermeableSoilsImpactsUseCase,
  ProjectRepository as SoilsDistributionProjectRepository,
} from "src/project-impacts/core/getProjectPermeableSoilsImpacts.usecase";
import { InMemoryProjectRepository } from "../secondary/project-repository/InMemoryProjectRepository";
import { ProjectImpactsController } from "./projectImpacts.controller";

@Module({
  controllers: [ProjectImpactsController],
  providers: [
    {
      provide: InMemoryProjectRepository,
      useFactory: () =>
        new InMemoryProjectRepository({
          decontaminatedSoilsSurface: 0,
          soilsDistribution: {
            current: [],
            future: [],
          },
        }),
    },
    {
      provide: GetProjectPermeableSoilsImpactsUseCase,
      useFactory: (projectRepo: SoilsDistributionProjectRepository) =>
        new GetProjectPermeableSoilsImpactsUseCase(projectRepo),
      inject: [InMemoryProjectRepository],
    },
    {
      provide: GetProjectContaminatedSoilsImpactUseCase,
      useFactory: (projectRepo: ContaminatedSoilProjectRepository) =>
        new GetProjectContaminatedSoilsImpactUseCase(projectRepo),
      inject: [InMemoryProjectRepository],
    },
  ],
})
export class ProjectImpactsModule {}
