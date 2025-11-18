import { Controller, Get, NotFoundException, Req, UseGuards } from "@nestjs/common";

import { JwtAuthGuard, RequestWithAuthenticatedUser } from "src/auth/adapters/JwtAuthGuard";
import { GetUserSiteEvaluationsUseCase } from "src/site-evaluations/core/usecases/getUserSiteEvaluations.usecase";

@Controller("site-evaluations")
export class SiteEvaluationController {
  constructor(private readonly getUserSiteEvaluationsUseCase: GetUserSiteEvaluationsUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserList(@Req() req: RequestWithAuthenticatedUser) {
    const result = await this.getUserSiteEvaluationsUseCase.execute({
      userId: req.accessTokenPayload.userId,
    });

    if (result.isFailure()) {
      throw new NotFoundException(result.getError());
    }

    return result.getData();
  }
}
