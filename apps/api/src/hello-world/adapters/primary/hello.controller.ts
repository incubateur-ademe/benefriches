import { Controller, Get } from "@nestjs/common";
import { SayHelloUseCase } from "../../core/usecases/sayHello.usecase";

@Controller("hello")
export class HelloController {
  constructor(private readonly sayHelloUseCase: SayHelloUseCase) {}

  @Get()
  getHello() {
    return this.sayHelloUseCase.execute();
  }
}
