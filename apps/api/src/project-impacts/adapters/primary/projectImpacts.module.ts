import { Module } from "@nestjs/common";
import {
  GetProjectPermeableSoilsImpactsUseCase,
  ProjectRepository,
} from "src/project-impacts/core/getProjectPermeableSoilsImpacts.usecase";
import { InMemoryProjectRepository } from "../secondary/project-repository/MockProjectRepository";
import { ProjectImpactsController } from "./projectImpacts.controller";

@Module({
  controllers: [ProjectImpactsController],
  providers: [
    {
      provide: InMemoryProjectRepository,
      useFactory: () =>
        new InMemoryProjectRepository({ current: [], future: [] }),
    },
    {
      provide: GetProjectPermeableSoilsImpactsUseCase,
      useFactory: (projectRepo: ProjectRepository) =>
        new GetProjectPermeableSoilsImpactsUseCase(projectRepo),
      inject: [InMemoryProjectRepository],
    },
  ],
})
export class ProjectImpactsModule {}
