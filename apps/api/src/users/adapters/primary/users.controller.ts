import { Body, Controller, Post } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";

import {
  createFeatureAlertProps,
  CreateUserFeatureAlertUseCase,
} from "src/users/core/usecases/createUserFeatureAlert.usecase";

class CreateFeatureAlertBodyDto extends createZodDto(createFeatureAlertProps) {}

@Controller("users")
export class UsersController {
  constructor(private readonly createFeatureAlertUseCase: CreateUserFeatureAlertUseCase) {}

  @Post("/feature-alert")
  async createFeatureAlert(@Body() createFeatureAlertBodySchema: CreateFeatureAlertBodyDto) {
    await this.createFeatureAlertUseCase.execute(createFeatureAlertBodySchema);
  }
}
