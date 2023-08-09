import { Module } from "@nestjs/common";
import { HelloController } from "./adapters/primary/hello.controller";
import { SayHelloUseCase } from "./domain/usecases/sayHello.usecase";

@Module({
  imports: [],
  controllers: [HelloController],
  providers: [SayHelloUseCase],
})
export class HelloModule {}
