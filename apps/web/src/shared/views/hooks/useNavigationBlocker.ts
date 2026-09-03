import { useCallback, useEffect, useRef, useState } from "react";
import { Route } from "type-route";

import { routes, session } from "@/app/router";

type BlockedNavigationState =
  | {
      retry: () => void;
      targetRoute: Route<typeof routes>;
      needConfirm: boolean;
    }
  | undefined;

type Props = {
  shouldBlockNavigation: boolean;
  allowRoute?: (route: Route<typeof routes>) => boolean;
};

export const useNavigationBlocker = ({ shouldBlockNavigation, allowRoute }: Props) => {
  const [blockedNavigation, setBlockedNavigation] = useState<BlockedNavigationState>(undefined);

  const unblockRef = useRef<(() => void) | null>(null);
  // Mirrors `shouldBlockNavigation` for use inside `onConfirmNavigation` without adding it to
  // that callback's own dependency array (see the comment there for why).
  const shouldBlockNavigationRef = useRef(shouldBlockNavigation);
  shouldBlockNavigationRef.current = shouldBlockNavigation;
  // The deferred resubscribe below (setTimeout) can still be pending when the component
  // unmounts — e.g. right after a confirmed exit, which is itself an allowed-navigation retry.
  // Without this guard it would fire anyway, attaching an orphaned `session.block` listener with
  // no owner left to clean it up, silently blocking unrelated future navigation app-wide.
  const isMountedRef = useRef(true);
  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  const subscribe = useCallback(() => {
    const unblock = session.block((blocker) => {
      setBlockedNavigation(() => ({
        retry: blocker.retry,
        targetRoute: blocker.route,
        needConfirm: allowRoute?.(blocker.route) === false,
      }));
    });
    unblockRef.current = unblock;
  }, [allowRoute]);

  const onConfirmNavigation = useCallback(() => {
    if (blockedNavigation?.retry) {
      if (unblockRef.current) {
        unblockRef.current();
        unblockRef.current = null;
      }
      blockedNavigation.retry();
      // An "allowed" navigation (e.g. step-to-step movement inside the wizard, auto-confirmed
      // below) must not permanently tear down blocking: `shouldBlockNavigation` stays true
      // (still dirty) after it, so re-subscribe once it settles, or every navigation after this
      // one would go through unblocked — see ticket 17's QA report for the regression this fixes.
      //
      // Deferred, and by more than a tick: for a browser back/forward (POP), the underlying
      // `history` package's retry (see its `handlePop`/`blockedPopTx`) resolves through its own
      // `history.go()` call, itself dispatched as a fresh, separately-scheduled `popstate` — not
      // synchronously, and not reliably within the same macrotask as a `setTimeout(fn, 0)`
      // (confirmed empirically: a 0ms defer still re-subscribes before that popstate lands,
      // re-blocking retry's own in-flight pop and recursing indefinitely). A short delay gives
      // the browser's popstate round-trip time to land first.
      if (shouldBlockNavigationRef.current) {
        setTimeout(() => {
          if (isMountedRef.current) subscribe();
        }, 100);
      }
    }
    setBlockedNavigation(undefined);
    // `blockedNavigation` and `subscribe` only, deliberately: adding `shouldBlockNavigation`
    // would redefine this callback (and re-run the effect below) on every dirty/idle toggle,
    // which isn't needed since the ref above always has the current value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockedNavigation, subscribe]);

  useEffect(() => {
    if (!blockedNavigation?.needConfirm) {
      onConfirmNavigation();
    }
  }, [blockedNavigation, onConfirmNavigation]);

  useEffect(() => {
    if (!shouldBlockNavigation) {
      if (unblockRef.current) {
        unblockRef.current();
        unblockRef.current = null;
      }
      setBlockedNavigation(undefined);
      return;
    }

    subscribe();

    return () => {
      if (unblockRef.current) {
        unblockRef.current();
        unblockRef.current = null;
      }
    };
  }, [shouldBlockNavigation, subscribe]);

  return {
    isModalOpened: blockedNavigation?.needConfirm === true,
    onConfirmNavigation,
    onCancelNavigation: () => {
      setBlockedNavigation(undefined);
    },
  };
};
