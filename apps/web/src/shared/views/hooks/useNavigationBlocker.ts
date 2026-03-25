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

  const onConfirmNavigation = useCallback(() => {
    if (blockedNavigation?.retry) {
      if (unblockRef.current) {
        unblockRef.current();
        unblockRef.current = null;
      }
      blockedNavigation.retry();
    }
    setBlockedNavigation(undefined);
  }, [blockedNavigation]);

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

    const unblock = session.block((blocker) => {
      setBlockedNavigation(() => ({
        retry: blocker.retry,
        targetRoute: blocker.route,
        needConfirm: allowRoute?.(blocker.route) === false,
      }));
    });

    unblockRef.current = unblock;

    return () => {
      unblock();
      unblockRef.current = null;
    };
  }, [shouldBlockNavigation, allowRoute]);

  return {
    isModalOpened: blockedNavigation?.needConfirm === true,
    onConfirmNavigation,
    onCancelNavigation: () => {
      setBlockedNavigation(undefined);
    },
  };
};
