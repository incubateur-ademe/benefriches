import { Module } from "@nestjs/common";
import { SayHelloUseCase } from "../../domain/usecases/sayHello.usecase";
import { HelloController } from "./hello.controller";

@Module({
  controllers: [HelloController],
  providers: [SayHelloUseCase],
})
export class HelloModule {}
