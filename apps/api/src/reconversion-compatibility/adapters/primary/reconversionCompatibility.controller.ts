import { Body, Controller, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { JwtAuthGuard } from "src/auth/adapters/JwtAuthGuard";
import { StartReconversionCompatibilityEvaluationUseCase } from "src/reconversion-compatibility/core/usecases/startReconversionCompatibilityEvaluation.usecase";

const startReconversionCompatibilityEvaluationBodySchema = z.object({
  id: z.uuid(),
});

class StartReconversionCompatibilityEvaluationBodyDto extends createZodDto(
  startReconversionCompatibilityEvaluationBodySchema,
) {}

@Controller("reconversion-compatibility")
export class ReconversionCompatibilityController {
  constructor(
    private readonly startReconversionCompatibilityEvaluationUseCase: StartReconversionCompatibilityEvaluationUseCase,
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
}
