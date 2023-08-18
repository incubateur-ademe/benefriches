import { UseCase } from "../../../shared-kernel/usecase";

export class SayHelloUseCase implements UseCase<Request, string> {
  execute() {
    return Promise.resolve(`Hello!`);
  }
}
