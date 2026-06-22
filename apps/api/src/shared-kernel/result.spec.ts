import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { success, fail } from "./result";

describe("Result Class", () => {
  describe("success result", () => {
    it("creates success result with void data", () => {
      const result = success();

      assert.strictEqual(result.isSuccess(), true);
      assert.strictEqual(result.isFailure(), false);
      // oxlint-disable-next-line @typescript-eslint/no-confusing-void-expression
      assert.strictEqual(result.getData(), undefined);
    });

    it("creates success result with object data", () => {
      const data = { userId: "123", email: "test@example.com" };
      const result = success(data);

      assert.strictEqual(result.isSuccess(), true);
      assert.deepStrictEqual(result.getData(), data);
    });

    it("creates success result with array data", () => {
      const data = [1, 2, 3];
      const result = success(data);

      assert.strictEqual(result.isSuccess(), true);
      assert.deepStrictEqual(result.getData(), data);
    });

    it("creates success result with string data", () => {
      const data = "success message";
      const result = success(data);

      assert.strictEqual(result.isSuccess(), true);
      assert.deepStrictEqual(result.getData(), data);
    });

    it("should not have getError or getIssues methods", () => {
      const result = success({ id: "123" });

      // @ts-expect-error getError should not exist on success result
      assert.strictEqual(typeof result.getError, "undefined");
      // @ts-expect-error getIssues should not exist on success result
      assert.strictEqual(typeof result.getIssues, "undefined");
    });
  });

  describe("failure result", () => {
    it("should create failure with reason only", () => {
      const result = fail("UserNotFound");

      assert.strictEqual(result.isFailure(), true);
      assert.strictEqual(result.isSuccess(), false);
      assert.strictEqual(result.getError(), "UserNotFound");
      // oxlint-disable-next-line @typescript-eslint/no-confusing-void-expression
      assert.strictEqual(result.getIssues(), undefined);
    });

    it("should create failure with reason and issues", () => {
      const issues = [
        { field: "email", message: "Invalid email format" },
        { field: "password", message: "Too short" },
      ];
      const result = fail("ValidationFailed", issues);

      assert.strictEqual(result.isFailure(), true);
      assert.strictEqual(result.getError(), "ValidationFailed");
      assert.deepStrictEqual(result.getIssues(), issues);
    });

    it("should not have getData method", () => {
      const result = fail("SomeError");

      // @ts-expect-error getData should not exist on failure result
      assert.strictEqual(typeof result.getData, "undefined");
    });
  });
});
