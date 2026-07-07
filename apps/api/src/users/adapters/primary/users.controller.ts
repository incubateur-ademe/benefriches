import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";

import { JwtAuthGuard } from "src/auth/adapters/JwtAuthGuard";
import {
  createFeatureAlertProps,
  CreateUserFeatureAlertUseCase,
} from "src/users/core/usecases/createUserFeatureAlert.usecase";

class CreateFeatureAlertBodyDto extends createZodDto(createFeatureAlertProps) {}

@Controller("users")
export class UsersController {
  private readonly createFeatureAlertUseCase: CreateUserFeatureAlertUseCase;
  constructor(createFeatureAlertUseCase: CreateUserFeatureAlertUseCase) {
    this.createFeatureAlertUseCase = createFeatureAlertUseCase;
  }

  @UseGuards(JwtAuthGuard)
  @Post("/feature-alert")
  async createFeatureAlert(@Body() createFeatureAlertBodySchema: CreateFeatureAlertBodyDto) {
    await this.createFeatureAlertUseCase.execute(createFeatureAlertBodySchema);
  }
}
