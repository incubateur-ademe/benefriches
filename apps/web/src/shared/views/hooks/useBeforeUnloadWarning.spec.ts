import { renderHook } from "@testing-library/react";

import { useBeforeUnloadWarning } from "./useBeforeUnloadWarning";

function dispatchBeforeUnload(): Event {
  const event = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(event);
  return event;
}

describe("useBeforeUnloadWarning", () => {
  it("warns before the tab is closed while there are unsaved changes", () => {
    renderHook(() => {
      useBeforeUnloadWarning(true);
    });

    const event = dispatchBeforeUnload();

    expect(event.defaultPrevented).toBe(true);
  });

  it("does not warn when there is nothing to lose", () => {
    renderHook(() => {
      useBeforeUnloadWarning(false);
    });

    const event = dispatchBeforeUnload();

    expect(event.defaultPrevented).toBe(false);
  });

  it("stops warning once the changes are saved", () => {
    const { rerender } = renderHook(
      ({ shouldWarn }) => {
        useBeforeUnloadWarning(shouldWarn);
      },
      { initialProps: { shouldWarn: true } },
    );

    rerender({ shouldWarn: false });
    const event = dispatchBeforeUnload();

    expect(event.defaultPrevented).toBe(false);
  });
});
