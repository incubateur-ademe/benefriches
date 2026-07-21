import { describe, expect, it } from "vitest";

import { UrbanProjectNamingHandler } from "@/features/create-project/core/urban-project/step-handlers/naming/naming/naming.handler";

describe("Urban project creation - Steps - Naming", () => {
  it("generates a default project name", () => {
    const defaults = UrbanProjectNamingHandler.getDefaultAnswers();

    expect(defaults).toEqual({ name: expect.any(String) as string });
  });
});
