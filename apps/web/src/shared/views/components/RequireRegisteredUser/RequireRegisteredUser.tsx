import { useEffect } from "react";
import { useAppSelector } from "../../hooks/store.hooks";

import { routes } from "@/app/views/router";
import {
  isCurrentUserLoaded,
  selectCurrentUserId,
} from "@/features/users/application/user.reducer";

export default function RequireRegisteredUser({ children }: { children: React.ReactNode }) {
  const currentUserLoaded = useAppSelector(isCurrentUserLoaded);
  const currentUserId = useAppSelector(selectCurrentUserId);

  useEffect(() => {
    if (currentUserLoaded && !currentUserId) {
      routes.onboarding().replace();
    }
  }, [currentUserLoaded, currentUserId]);

  if (currentUserLoaded && currentUserId) return children;

  return null;
}
