import { useEffect } from "react";

import { isCurrentUserLoaded, selectCurrentUserId } from "@/features/onboarding/core/user.reducer";
import { routes } from "@/shared/views/router";

import { useAppSelector } from "../../hooks/store.hooks";

export default function RequireRegisteredUser({ children }: { children: React.ReactNode }) {
  const currentUserLoaded = useAppSelector(isCurrentUserLoaded);
  const currentUserId = useAppSelector(selectCurrentUserId);

  useEffect(() => {
    if (currentUserLoaded && !currentUserId) {
      routes.onBoardingIdentity().replace();
    }
  }, [currentUserLoaded, currentUserId]);

  if (currentUserLoaded && currentUserId) return children;

  return null;
}
