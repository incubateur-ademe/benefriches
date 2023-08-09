import { Controller, Get, Param } from "@nestjs/common";
import { SayHelloUseCase } from "../../domain/usecases/sayHello.usecase";

@Controller("hello")
export class HelloController {
  constructor(private readonly sayHelloUseCase: SayHelloUseCase) {}

  @Get(":name")
  getHello(@Param("name") name: string) {
    return this.sayHelloUseCase.execute({ to: name });
  }
}
