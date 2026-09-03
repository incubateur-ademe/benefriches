import { useEffect } from "react";

/**
 * Prompts the browser's native "leave site?" confirmation when the tab/window is closed or
 * reloaded while `shouldWarn` is true. Complements `useNavigationBlocker`, which only covers
 * in-app and history navigation — closing the tab never goes through type-route's `session`.
 *
 * Kept separate from `useNavigationBlocker` (rather than adding a flag there) because that hook
 * is shared with create-site, create-project and update-project: none of those flows should
 * start prompting on tab close as a side effect of a change scoped to update-site.
 *
 * Browsers ignore any custom message and show their own generic wording, so callers should not
 * rely on `event.returnValue`'s content — only on the prompt being shown at all.
 */
export const useBeforeUnloadWarning = (shouldWarn: boolean): void => {
  useEffect(() => {
    if (!shouldWarn) {
      return;
    }

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Legacy browsers require `returnValue` to be set for the prompt to appear.
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [shouldWarn]);
};
