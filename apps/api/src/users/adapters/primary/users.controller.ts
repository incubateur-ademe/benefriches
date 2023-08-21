import { Body, Controller, Post } from "@nestjs/common";
import { z } from "nestjs-zod/z";
import { createZodDto } from "nestjs-zod";
import { CreateUserUseCase } from "src/users/domain/usecases/CreateUser.usecase";

const CreateUserDtoSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

class CreateUserDto extends createZodDto(CreateUserDtoSchema) {}

@Controller("users")
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    await this.createUserUseCase.execute(createUserDto);
  }
}
