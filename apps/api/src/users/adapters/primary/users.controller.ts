import { Body, Controller, Post } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { CreateUserUseCase } from "src/users/core/usecases/createUser.usecase";
import {
  createFeatureAlertProps,
  CreateUserFeatureAlertUseCase,
} from "src/users/core/usecases/createUserFeatureAlert.usecase";

export const createUserBodychema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  structureType: z.string(),
  structureActivity: z.string(),
  structureName: z.string().optional(),
  personalDataStorageConsented: z.literal(true),
  personalDataAnalyticsUseConsented: z.boolean(),
  personalDataCommunicationUseConsented: z.boolean(),
});

class CreateUserBodyDto extends createZodDto(createUserBodychema) {}

class CreateFeatureAlertBodyDto extends createZodDto(createFeatureAlertProps) {}

@Controller("users")
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly createFeatureAlertUseCase: CreateUserFeatureAlertUseCase,
  ) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserBodyDto) {
    await this.createUserUseCase.execute({
      user: createUserDto,
    });
  }

  @Post("/feature-alert")
  async createFeatureAlert(@Body() createFeatureAlertBodySchema: CreateFeatureAlertBodyDto) {
    await this.createFeatureAlertUseCase.execute(createFeatureAlertBodySchema);
  }
}
