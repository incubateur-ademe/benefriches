import { useAppSelector } from "../../hooks/store.hooks";

import { routes } from "@/app/views/router";
import {
  isCurrentUserLoaded,
  selectCurrentUserId,
} from "@/features/users/application/user.reducer";

export default function RequireRegisteredUser({ children }: { children: React.ReactNode }) {
  const currentUserLoaded = useAppSelector(isCurrentUserLoaded);
  const currentUserId = useAppSelector(selectCurrentUserId);

  if (!currentUserLoaded) {
    return null;
  }

  if (!currentUserId) {
    routes.onboarding().replace();
    return null;
  }

  return children;
}
