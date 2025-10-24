import { type TResult } from "./result";

export interface UseCase<TRequest, TResultType extends TResult<unknown, string, unknown>> {
  execute(request: TRequest): Promise<TResultType>;
}
