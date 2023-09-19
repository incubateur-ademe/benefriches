import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { LoginUseCase } from "src/auth/domain/usecases/Login.usecase";

const LoginDtoSchema = z.object({
  email: z.string(),
  password: z.string(),
});

class LoginDto extends createZodDto(LoginDtoSchema) {}

@Controller("auth")
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @HttpCode(200)
  @Post("/login")
  async login(@Body() loginDto: LoginDto) {
    const accessToken = await this.loginUseCase.execute(loginDto);
    return { accessToken };
  }
}
