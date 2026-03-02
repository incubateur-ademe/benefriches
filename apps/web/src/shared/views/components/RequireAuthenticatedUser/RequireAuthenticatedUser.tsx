import { useEffect } from "react";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { routes, useRoute } from "@/app/router";

export default function RequireAuthenticatedUser({ children }: { children: React.ReactNode }) {
  const currentRoute = useRoute();
  const currentUserState = useAppSelector((state) => state.currentUser.currentUserState);

  useEffect(() => {
    if (currentUserState === "unauthenticated") {
      const redirectTo = `${window.location.origin}${currentRoute.href}`;
      routes.accessBenefriches({ redirectTo }).replace();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserState]);

  if (currentUserState === "authenticated") return children;

  return null;
}
