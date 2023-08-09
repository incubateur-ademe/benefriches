import { UseCase } from "../../../shared-kernel/usecase";

type Request = {
  to: string;
};

export class SayHelloUseCase implements UseCase<Request, string> {
  execute(request: Request) {
    return Promise.resolve(`Hello ${request.to}!`);
  }
}
