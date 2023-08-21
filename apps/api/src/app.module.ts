import { Module } from "@nestjs/common";
import { HelloModule } from "./hello-world/adapters/primary/hello.module";
import { UsersModule } from "./users/adapters/primary/users.module";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { AuthModule } from "./auth/adapters/primary/auth.module";

@Module({
  imports: [AuthModule, HelloModule, UsersModule],
  providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
