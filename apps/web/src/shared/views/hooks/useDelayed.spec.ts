import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDelayed } from "./useDelayed";

describe("useDelayed", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns false initially when condition is true", () => {
    const { result } = renderHook(() => useDelayed(true, 1000));
    expect(result.current).toBe(false);
  });

  it("returns true after the delay when condition is true", () => {
    const { result } = renderHook(() => useDelayed(true, 1000));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(true);
  });

  it("returns false before the delay elapses", () => {
    const { result } = renderHook(() => useDelayed(true, 1000));

    act(() => {
      vi.advanceTimersByTime(999);
    });

    expect(result.current).toBe(false);
  });

  it("resets to false when condition becomes false", () => {
    const { result, rerender } = renderHook(({ condition }) => useDelayed(condition, 1000), {
      initialProps: { condition: true },
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(true);

    rerender({ condition: false });
    expect(result.current).toBe(false);
  });

  it("returns false when condition is false", () => {
    const { result } = renderHook(() => useDelayed(false, 1000));

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current).toBe(false);
  });
});
