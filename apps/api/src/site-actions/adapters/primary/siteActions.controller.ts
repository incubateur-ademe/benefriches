import { Body, Controller, Get, NotFoundException, Param, Patch, UseGuards } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import {
  updateSiteActionStatusDtoSchema,
  type UpdateSiteActionStatusDto,
  type GetSiteActionsResponseDto,
} from "shared";

import { JwtAuthGuard } from "src/auth/adapters/JwtAuthGuard";
import { GetSiteActionsUseCase } from "src/site-actions/core/usecases/getSiteActions.usecase";
import { UpdateSiteActionStatusUseCase } from "src/site-actions/core/usecases/updateSiteActionStatus.usecase";

@Controller()
export class SiteActionsController {
  constructor(
    private readonly getSiteActionsUseCase: GetSiteActionsUseCase,
    private readonly updateSiteActionStatusUseCase: UpdateSiteActionStatusUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get("sites/:siteId/actions")
  async getSiteActions(@Param("siteId") siteId: string): Promise<GetSiteActionsResponseDto> {
    const result = await this.getSiteActionsUseCase.execute({ siteId });

    return result.isSuccess() ? result.getData() : [];
  }

  @UseGuards(JwtAuthGuard)
  @Patch("sites/:siteId/actions/:actionId/status")
  async updateSiteActionStatus(
    @Param("siteId") siteId: string,
    @Param("actionId") actionId: string,
    @Body(new ZodValidationPipe(updateSiteActionStatusDtoSchema))
    updateStatusDto: UpdateSiteActionStatusDto,
  ): Promise<void> {
    const result = await this.updateSiteActionStatusUseCase.execute({
      siteId,
      actionId,
      status: updateStatusDto.status,
    });

    if (result.isFailure()) {
      switch (result.getError()) {
        case "ActionNotFound":
          throw new NotFoundException({
            error: "ACTION_NOT_FOUND",
            message: `Action ${actionId} not found for site ${siteId}`,
          });
      }
    }
  }
}
