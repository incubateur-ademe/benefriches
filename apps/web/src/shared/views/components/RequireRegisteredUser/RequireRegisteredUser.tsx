import { useAppSelector } from "../../hooks/store.hooks";

import { routes } from "@/app/views/router";
import {
  isCurrentUserLoaded,
  selectCurrentUserId,
} from "@/features/users/application/user.reducer";

export default function RequireRegisteredUser({ children }: { children: React.ReactNode }) {
  const currentUserLoaded = useAppSelector(isCurrentUserLoaded);
  const currentUserId = useAppSelector(selectCurrentUserId);

  console.log(currentUserLoaded, currentUserId);
  if (!currentUserLoaded) {
    return null;
  }

  if (!currentUserId) {
    routes.onboarding().replace();
    return null;
  }

  return children;
}
