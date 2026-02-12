import { useEffect, useRef, useState } from "react";
import { Route } from "type-route";

import { routes, session } from "../router";

type BlockedNavigationState =
  | {
      retry: () => void;
      targetRoute: Route<typeof routes>;
    }
  | undefined;

type Props = {
  shouldBlockNavigation: boolean;
  allowRoute?: (route: Route<typeof routes>) => boolean;
};

export const useNavigationBlocker = ({ shouldBlockNavigation, allowRoute }: Props) => {
  const [blockedNavigation, setBlockedNavigation] = useState<BlockedNavigationState>(undefined);

  const unblockRef = useRef<(() => void) | null>(null);

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
      if (allowRoute?.(blocker.route)) {
        return true;
      }
      setBlockedNavigation(() => ({
        retry: blocker.retry,
        targetRoute: blocker.route,
      }));
      return false;
    });

    unblockRef.current = unblock;

    return () => {
      unblock();
      unblockRef.current = null;
    };
  }, [shouldBlockNavigation, allowRoute]);

  return {
    isModalOpened: blockedNavigation !== undefined,
    onConfirmNavigation: () => {
      if (blockedNavigation?.retry) {
        if (unblockRef.current) {
          unblockRef.current();
          unblockRef.current = null;
        }
        blockedNavigation.retry();
      }
      setBlockedNavigation(undefined);
    },
    onCancelNavigation: () => {
      setBlockedNavigation(undefined);
    },
  };
};
