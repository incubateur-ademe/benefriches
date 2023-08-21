import { Body, Controller, Post } from "@nestjs/common";
import { z } from "nestjs-zod/z";
import { createZodDto } from "nestjs-zod";
import { CreateUserUseCase } from "src/users/domain/usecases/CreateUser.usecase";
import { LoginUseCase } from "src/users/domain/usecases/Login.usecase";

const CreateUserDtoSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

class CreateUserDto extends createZodDto(CreateUserDtoSchema) {}

const LoginDtoSchema = z.object({
  email: z.string(),
  password: z.string(),
});

class LoginDto extends createZodDto(LoginDtoSchema) {}

@Controller("users")
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    await this.createUserUseCase.execute(createUserDto);
  }

  @Post("/login")
  async login(@Body() loginDto: LoginDto) {
    const accessToken = await this.loginUseCase.execute(loginDto);
    return { accessToken };
  }
}
