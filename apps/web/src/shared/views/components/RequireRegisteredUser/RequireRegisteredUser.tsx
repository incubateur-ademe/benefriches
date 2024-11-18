import { useEffect } from "react";

import { routes } from "@/app/views/router";
import { isCurrentUserLoaded, selectCurrentUserId } from "@/users/application/user.reducer";

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
