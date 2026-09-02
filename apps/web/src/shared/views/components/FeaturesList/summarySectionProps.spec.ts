import { describe, expect, it, vi } from "vitest";

import { getSummarySectionProps, WARNING_TEXT } from "./summarySectionProps";

describe("getSummarySectionProps", () => {
  it("targets the first step and sets no warning when every step is completed", () => {
    const onNavigateToStep = vi.fn();

    const { warning, buttonProps } = getSummarySectionProps(
      [
        { stepId: "STEP_1", isStepCompleted: true },
        { stepId: "STEP_2", isStepCompleted: true },
      ],
      onNavigateToStep,
    );

    expect(warning).toBeUndefined();
    expect(buttonProps).toBeDefined();

    buttonProps?.onClick?.({} as never);
    expect(onNavigateToStep).toHaveBeenCalledExactlyOnceWith("STEP_1");
  });

  it("sets a warning and targets the FIRST not-completed step when one is present", () => {
    const onNavigateToStep = vi.fn();

    const { warning, buttonProps } = getSummarySectionProps(
      [
        { stepId: "STEP_1", isStepCompleted: true },
        { stepId: "STEP_2", isStepCompleted: false },
        { stepId: "STEP_3", isStepCompleted: false },
      ],
      onNavigateToStep,
    );

    expect(warning).toBe(WARNING_TEXT);

    buttonProps?.onClick?.({} as never);
    expect(onNavigateToStep).toHaveBeenCalledExactlyOnceWith("STEP_2");
  });

  it("returns neither warning nor buttonProps for an empty step list", () => {
    const onNavigateToStep = vi.fn();

    const result = getSummarySectionProps([], onNavigateToStep);

    expect(result.warning).toBeUndefined();
    expect(result.buttonProps).toBeUndefined();
  });
});
