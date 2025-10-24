import { describe, expect, it } from "vitest";

import { success, fail } from "./result";

describe("Result Class", () => {
  describe("success result", () => {
    it("creates success result with void data", () => {
      const result = success();

      expect(result.isSuccess()).toBe(true);
      expect(result.isFailure()).toBe(false);
      // oxlint-disable-next-line @typescript-eslint/no-confusing-void-expression
      expect(result.getData()).toBeUndefined();
    });

    it("creates success result with object data", () => {
      const data = { userId: "123", email: "test@example.com" };
      const result = success(data);

      expect(result.isSuccess()).toBe(true);
      expect(result.getData()).toEqual(data);
    });

    it("creates success result with array data", () => {
      const data = [1, 2, 3];
      const result = success(data);

      expect(result.isSuccess()).toBe(true);
      expect(result.getData()).toEqual(data);
    });

    it("creates success result with string data", () => {
      const data = "success message";
      const result = success(data);

      expect(result.isSuccess()).toBe(true);
      expect(result.getData()).toEqual(data);
    });

    it("should not have getError or getIssues methods", () => {
      const result = success({ id: "123" });

      // @ts-expect-error getError should not exist on success result
      expect(typeof result.getError).toBe("undefined");
      // @ts-expect-error getIssues should not exist on success result
      expect(typeof result.getIssues).toBe("undefined");
    });
  });

  describe("failure result", () => {
    it("should create failure with reason only", () => {
      const result = fail("UserNotFound");

      expect(result.isFailure()).toBe(true);
      expect(result.isSuccess()).toBe(false);
      expect(result.getError()).toBe("UserNotFound");
      // oxlint-disable-next-line @typescript-eslint/no-confusing-void-expression
      expect(result.getIssues()).toBeUndefined();
    });

    it("should create failure with reason and issues", () => {
      const issues = [
        { field: "email", message: "Invalid email format" },
        { field: "password", message: "Too short" },
      ];
      const result = fail("ValidationFailed", issues);

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe("ValidationFailed");
      expect(result.getIssues()).toEqual(issues);
    });

    it("should not have getData method", () => {
      const result = fail("SomeError");

      // @ts-expect-error getData should not exist on failure result
      expect(typeof result.getData).toBe("undefined");
    });
  });
});
