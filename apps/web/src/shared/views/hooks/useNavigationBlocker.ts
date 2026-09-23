import { useCallback, useEffect, useRef, useState } from "react";
import type { Route } from "type-route";

import type { routes } from "@/app/router";
import { session, useRoute } from "@/app/router";

type NavigationAction = Route<typeof routes>["action"];

/** An intercepted navigation, held until the user answers the confirmation dialog. */
type ConfirmationRequest = { retry: () => void };

/**
 * A `pop` retry (see below) is expected to land as a navigation event. This only exists so a
 * `pop` that somehow never lands can't leave the form permanently unguarded.
 */
const POP_RETRY_SAFETY_NET_MS = 500;

/**
 * Guards a form flow against leaving with unsaved changes.
 *
 * Navigation that stays on the current route passes through silently — that is how a wizard
 * moves between its own steps, since each step syncs the URL. Anything leaving the route is
 * held back and reported through `isModalOpened`, for the consumer to render its own
 * confirmation dialog and answer with `onConfirmNavigation` / `onCancelNavigation`.
 *
 * Note that a blocked navigation is *dropped*, not merely deferred: type-route has no veto
 * mechanism, and the click that triggered it was already `preventDefault`-ed. So a blocker left
 * armed with no owner is invisible — the app simply stops navigating. Everything below is
 * arranged so that can't happen.
 */
export const useNavigationBlocker = (shouldBlockNavigation: boolean) => {
  const [confirmationRequest, setConfirmationRequest] = useState<ConfirmationRequest>();

  const currentRouteName = useRoute().name;

  // Read from inside `session.block` callbacks, which outlive the render that registered them.
  const currentRouteNameRef = useRef(currentRouteName);
  const shouldBlockNavigationRef = useRef(shouldBlockNavigation);
  useEffect(() => {
    currentRouteNameRef.current = currentRouteName;
    shouldBlockNavigationRef.current = shouldBlockNavigation;
  });

  const unblockRef = useRef<(() => void) | null>(null);
  const isMountedRef = useRef(true);
  // Cancels the pending `pop` resubscribe, when there is one.
  const cancelPendingResubscribeRef = useRef<(() => void) | null>(null);
  // Lets the deferred resubscribe below reach `subscribe`, which is defined after it.
  const subscribeRef = useRef<() => void>(() => {});

  useEffect(() => {
    // Assigned here rather than only in the cleanup, so React StrictMode's
    // create -> destroy -> create cycle doesn't leave this stuck at `false`.
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const unblock = useCallback(() => {
    unblockRef.current?.();
    unblockRef.current = null;
  }, []);

  const cancelPendingResubscribe = useCallback(() => {
    cancelPendingResubscribeRef.current?.();
  }, []);

  const resubscribeOnceNavigationLanded = useCallback(
    (action: NavigationAction) => {
      if (action !== "pop") {
        // `push` and `replace` are retried synchronously: type-route's `navigate()` re-enters with
        // no blocker registered and completes the navigation before `retry()` returns. So by now
        // it is already done and we can re-arm in the same tick, leaving no window at all.
        subscribeRef.current();
        return;
      }

      // A `pop` (browser back/forward) is different: `history` resolves the retry through its own
      // `history.go()`, dispatched as a separately scheduled `popstate`. Re-arming before it lands
      // would block the retry's own pop and recurse, so wait for the navigation event itself.
      cancelPendingResubscribe();
      let settled = false;
      const stopWaiting = () => {
        settled = true;
        unlisten();
        clearTimeout(timer);
        cancelPendingResubscribeRef.current = null;
      };
      const resubscribe = () => {
        if (settled) return;
        stopWaiting();
        if (isMountedRef.current && shouldBlockNavigationRef.current) subscribeRef.current();
      };
      const unlisten = session.listen(resubscribe);
      const timer = setTimeout(resubscribe, POP_RETRY_SAFETY_NET_MS);
      cancelPendingResubscribeRef.current = stopWaiting;
    },
    [cancelPendingResubscribe],
  );

  const subscribe = useCallback(() => {
    // Defensive: a second subscription must never orphan the first one's handle, since nothing
    // would be left able to remove it.
    unblock();
    unblockRef.current = session.block(({ route, retry }) => {
      if (route.name !== currentRouteNameRef.current) {
        setConfirmationRequest({ retry });
        return;
      }
      // Staying on the same route — the flow navigating within itself. Let it through, then
      // re-arm: the form is still dirty, so blocking must survive its own step changes.
      unblock();
      retry();
      resubscribeOnceNavigationLanded(route.action);
    });
  }, [unblock, resubscribeOnceNavigationLanded]);
  useEffect(() => {
    subscribeRef.current = subscribe;
  }, [subscribe]);

  const onConfirmNavigation = useCallback(() => {
    if (!confirmationRequest) return;
    // No re-arming here, unlike the same-route case above: the user has chosen to leave the
    // guarded flow, so this component is on its way out.
    unblock();
    confirmationRequest.retry();
    setConfirmationRequest(undefined);
  }, [confirmationRequest, unblock]);

  const onCancelNavigation = useCallback(() => {
    // The navigation was already dropped and the blocker is still armed; nothing else to undo.
    setConfirmationRequest(undefined);
  }, []);

  // Drop any pending confirmation the instant blocking turns off, rather than in the effect below:
  // setting state directly from an effect body forces an extra render/commit cycle.
  const [wasBlocking, setWasBlocking] = useState(shouldBlockNavigation);
  if (shouldBlockNavigation !== wasBlocking) {
    setWasBlocking(shouldBlockNavigation);
    if (!shouldBlockNavigation) {
      setConfirmationRequest(undefined);
    }
  }

  useEffect(() => {
    if (!shouldBlockNavigation) {
      cancelPendingResubscribe();
      unblock();
      return;
    }

    subscribe();

    return () => {
      cancelPendingResubscribe();
      unblock();
    };
  }, [shouldBlockNavigation, subscribe, unblock, cancelPendingResubscribe]);

  return {
    isModalOpened: confirmationRequest !== undefined,
    onConfirmNavigation,
    onCancelNavigation,
  };
};
