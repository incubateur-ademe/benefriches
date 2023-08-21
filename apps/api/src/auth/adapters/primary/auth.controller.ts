import { Body, Controller, Post } from "@nestjs/common";
import { z } from "nestjs-zod/z";
import { createZodDto } from "nestjs-zod";
import { LoginUseCase } from "src/auth/domain/usecases/Login.usecase";

const LoginDtoSchema = z.object({
  email: z.string(),
  password: z.string(),
});

class LoginDto extends createZodDto(LoginDtoSchema) {}

@Controller("auth")
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post("/login")
  async login(@Body() loginDto: LoginDto) {
    const accessToken = await this.loginUseCase.execute(loginDto);
    return { accessToken };
  }
}
