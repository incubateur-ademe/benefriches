import {
  Body,
  Controller,
  InternalServerErrorException,
  ConflictException,
  Post,
  Req,
  UseGuards,
  Param,
} from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { JwtAuthGuard, RequestWithAuthenticatedUser } from "src/auth/adapters/JwtAuthGuard";
import { AddRelatedSiteToReconversionCompatibilityEvaluationUseCase } from "src/reconversion-compatibility/core/usecases/addRelatedSiteToReconversionCompatibilityEvaluation.usecase";
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

const addRelatedSiteIdBodySchema = z.object({
  relatedSiteId: z.uuid(),
});

class AddRelatedSiteBodyDto extends createZodDto(addRelatedSiteIdBodySchema) {}

@Controller("reconversion-compatibility")
export class ReconversionCompatibilityController {
  constructor(
    private readonly startReconversionCompatibilityEvaluationUseCase: StartReconversionCompatibilityEvaluationUseCase,
    private readonly completeReconversionCompatibilityEvaluationUseCase: CompleteReconversionCompatibilityEvaluationUseCase,
    private readonly addRelatedSiteToReconversionCompatibilityEvaluationUseCase: AddRelatedSiteToReconversionCompatibilityEvaluationUseCase,
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
  @Post(":evaluationId/add-related-site")
  async addSiteCreation(
    @Param("evaluationId") evaluationId: string,
    @Body() body: AddRelatedSiteBodyDto,
  ) {
    const result = await this.addRelatedSiteToReconversionCompatibilityEvaluationUseCase.execute({
      evaluationId: evaluationId,
      relatedSiteId: body.relatedSiteId,
    });

    if (result.isFailure()) {
      throw new InternalServerErrorException(result.getError());
    }
  }
}
