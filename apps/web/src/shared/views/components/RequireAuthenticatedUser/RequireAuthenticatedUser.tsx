import { useEffect } from "react";

import { routes } from "@/shared/views/router";

import { useAppSelector } from "../../hooks/store.hooks";

export default function RequireAuthenticatedUser({ children }: { children: React.ReactNode }) {
  const currentUserState = useAppSelector((state) => state.currentUser.currentUserState);

  useEffect(() => {
    if (currentUserState === "unauthenticated") {
      routes.login().replace();
    }
  }, [currentUserState]);

  if (currentUserState === "authenticated") return children;

  return null;
}
