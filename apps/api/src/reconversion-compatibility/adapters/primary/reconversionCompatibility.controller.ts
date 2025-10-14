import { Body, Controller, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { JwtAuthGuard } from "src/auth/adapters/JwtAuthGuard";
import { AddProjectCreationToReconversionCompatibilityEvaluationUseCase } from "src/reconversion-compatibility/core/usecases/addProjectCreationToReconversionCompatibilityEvaluation.usecase";
import { CompleteReconversionCompatibilityEvaluationUseCase } from "src/reconversion-compatibility/core/usecases/completeReconversionCompatibilityEvaluation.usecase";
import { StartReconversionCompatibilityEvaluationUseCase } from "src/reconversion-compatibility/core/usecases/startReconversionCompatibilityEvaluation.usecase";

const startReconversionCompatibilityEvaluationBodySchema = z.object({
  id: z.uuid(),
});

class StartReconversionCompatibilityEvaluationBodyDto extends createZodDto(
  startReconversionCompatibilityEvaluationBodySchema,
) {}

const completeReconversionCompatibilityEvaluationBodySchema = z.object({
  id: z.string(),
  mutafrichesId: z.string(),
});

class CompleteReconversionCompatibilityEvaluationBodyDto extends createZodDto(
  completeReconversionCompatibilityEvaluationBodySchema,
) {}

const addProjectCreationBodySchema = z.object({
  evaluationId: z.uuid(),
  reconversionProjectId: z.uuid(),
});

class AddProjectCreationBodyDto extends createZodDto(addProjectCreationBodySchema) {}

@Controller("reconversion-compatibility")
export class ReconversionCompatibilityController {
  constructor(
    private readonly startReconversionCompatibilityEvaluationUseCase: StartReconversionCompatibilityEvaluationUseCase,
    private readonly completeReconversionCompatibilityEvaluationUseCase: CompleteReconversionCompatibilityEvaluationUseCase,
    private readonly addProjectCreationToReconversionCompatibilityEvaluationUseCase: AddProjectCreationToReconversionCompatibilityEvaluationUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post("start-evaluation")
  async startEvaluation(
    @Body() body: StartReconversionCompatibilityEvaluationBodyDto,
    @Req() request: Request,
  ) {
    const { accessTokenPayload } = request;
    if (!accessTokenPayload) throw new UnauthorizedException();

    await this.startReconversionCompatibilityEvaluationUseCase.execute({
      id: body.id,
      createdById: accessTokenPayload.userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post("complete-evaluation")
  async completeEvaluation(@Body() body: CompleteReconversionCompatibilityEvaluationBodyDto) {
    await this.completeReconversionCompatibilityEvaluationUseCase.execute({
      id: body.id,
      mutafrichesId: body.mutafrichesId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post("add-project-creation")
  async addProjectCreation(@Body() body: AddProjectCreationBodyDto) {
    await this.addProjectCreationToReconversionCompatibilityEvaluationUseCase.execute({
      evaluationId: body.evaluationId,
      reconversionProjectId: body.reconversionProjectId,
    });
  }
}
