import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import type { z } from "zod";

import { JwtAuthGuard } from "src/auth/adapters/JwtAuthGuard";
import {
  createFeatureAlertProps,
  CreateUserFeatureAlertUseCase,
} from "src/users/core/usecases/createUserFeatureAlert.usecase";

@Controller("users")
export class UsersController {
  private readonly createFeatureAlertUseCase: CreateUserFeatureAlertUseCase;
  constructor(createFeatureAlertUseCase: CreateUserFeatureAlertUseCase) {
    this.createFeatureAlertUseCase = createFeatureAlertUseCase;
  }

  @UseGuards(JwtAuthGuard)
  @Post("/feature-alert")
  async createFeatureAlert(
    @Body({ schema: createFeatureAlertProps })
    createFeatureAlertBodySchema: z.infer<typeof createFeatureAlertProps>,
  ) {
    await this.createFeatureAlertUseCase.execute(createFeatureAlertBodySchema);
  }
}
