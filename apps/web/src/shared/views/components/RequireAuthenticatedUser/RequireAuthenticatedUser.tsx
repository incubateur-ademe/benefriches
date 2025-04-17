import { useEffect } from "react";

import { routes, useRoute } from "@/shared/views/router";

import { useAppSelector } from "../../hooks/store.hooks";

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
