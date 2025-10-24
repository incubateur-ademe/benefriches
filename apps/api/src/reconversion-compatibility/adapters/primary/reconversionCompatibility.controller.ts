import {
  Body,
  Controller,
  InternalServerErrorException,
  ConflictException,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { JwtAuthGuard, RequestWithAuthenticatedUser } from "src/auth/adapters/JwtAuthGuard";
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
    @Req() request: RequestWithAuthenticatedUser,
  ) {
    const result = await this.startReconversionCompatibilityEvaluationUseCase.execute({
      id: body.id,
      createdById: request.accessTokenPayload.userId,
    });

    if (result.isFailure()) {
      const error = result.getError();
      switch (error) {
        case "EvaluationAlreadyExists":
          throw new ConflictException(error);
        default:
          throw new InternalServerErrorException(error);
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post("complete-evaluation")
  async completeEvaluation(@Body() body: CompleteReconversionCompatibilityEvaluationBodyDto) {
    const result = await this.completeReconversionCompatibilityEvaluationUseCase.execute({
      id: body.id,
      mutafrichesId: body.mutafrichesId,
    });

    if (result.isFailure()) {
      throw new InternalServerErrorException(result.getError());
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post("add-project-creation")
  async addProjectCreation(@Body() body: AddProjectCreationBodyDto) {
    const result =
      await this.addProjectCreationToReconversionCompatibilityEvaluationUseCase.execute({
        evaluationId: body.evaluationId,
        reconversionProjectId: body.reconversionProjectId,
      });

    if (result.isFailure()) {
      throw new InternalServerErrorException(result.getError());
    }
  }
}
