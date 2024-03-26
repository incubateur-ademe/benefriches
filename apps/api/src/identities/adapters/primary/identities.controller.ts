import { Body, Controller, Post } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { CreateIdentityUseCase } from "src/identities/domain/usecases/createIdentity.usecase";

export const createIdentityInputSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  structureType: z.string().optional(),
  structureName: z.string().optional(),
  personalDataStorageConsented: z.literal(true),
  personalDataAnalyticsUseConsented: z.boolean(),
  personalDataCommunicationUseConsented: z.boolean(),
});

class CreateIdentityInputDto extends createZodDto(createIdentityInputSchema) {}

@Controller("identities")
export class IdentityController {
  constructor(private readonly createIdentityUseCase: CreateIdentityUseCase) {}

  @Post()
  async createIdentity(@Body() createIdentityDto: CreateIdentityInputDto) {
    await this.createIdentityUseCase.execute({
      identity: createIdentityDto,
    });
  }
}
