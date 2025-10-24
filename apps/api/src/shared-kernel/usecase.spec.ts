import { describe, expect, it } from "vitest";

import { type TResult, success, fail, SuccessResult } from "./result";
import { type UseCase } from "./usecase";

describe("UseCase interface type safety", () => {
  describe("UseCase with non-void result type", () => {
    type TestData = { userId: string; email: string };
    type TestResult = TResult<TestData, "UserNotFound">;

    it("should allow use case that returns success with correct data type", async () => {
      class ValidUseCase implements UseCase<void, TestResult> {
        execute(_request: void): Promise<TestResult> {
          // This should compile - returning success with correct data type
          return Promise.resolve(
            success<TestData>({
              userId: "123",
              email: "test@example.com",
            }),
          );
        }
      }
      const useCase = new ValidUseCase();
      const result = await useCase.execute();

      expect(result.isSuccess()).toBe(true);
      const resultData = (result as SuccessResult<TestData>).getData();
      expect(resultData.userId).toBe("123");
      expect(resultData.email).toBe("test@example.com");
    });

    it("should reject use case that returns success() without data", () => {
      class InvalidUseCase implements UseCase<void, TestResult> {
        execute(_request: void): Promise<TestResult> {
          // @ts-expect-error This should NOT compile - success() without data when TestData is expected
          return Promise.resolve(success());
        }
      }
      const useCase = new InvalidUseCase();
      expect(useCase).toBeDefined();
    });

    it("should allow use case that returns failure", async () => {
      class FailureUseCase implements UseCase<void, TestResult> {
        execute(_request: void): Promise<TestResult> {
          return Promise.resolve(fail("UserNotFound"));
        }
      }

      const useCase = new FailureUseCase();
      const result = await useCase.execute();

      expect(result.isFailure()).toBe(true);
    });
  });

  describe("UseCase with void result type", () => {
    type VoidResult = TResult<void, "OperationFailed">;

    class VoidUseCase implements UseCase<void, VoidResult> {
      execute(_request: void): Promise<VoidResult> {
        // This should compile - success() is valid for TResult<void>
        return Promise.resolve(success());
      }
    }

    it("should allow use case that returns success() for void result", async () => {
      const useCase = new VoidUseCase();
      const result = await useCase.execute();

      expect(result.isSuccess()).toBe(true);
    });
  });

  it("should catch incorrect data structure at compile time", () => {
    type Result = TResult<{ id: string; value: number }>;

    class IncorrectDataUseCase implements UseCase<void, Result> {
      execute(): Promise<Result> {
        // @ts-expect-error This should NOT compile - wrong data structure
        return success({ id: "123", wrongField: "oops" });
      }
    }
    const useCase = new IncorrectDataUseCase();
    expect(useCase).toBeDefined();
  });
});
