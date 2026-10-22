import { fr } from "@codegouvfr/react-dsfr";
import type { ReactNode } from "react";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { selectCurrentUserIsAdmin } from "@/shared/core/current-user/currentUser.selectors";

import AdminAccessDeniedAlert from "./AdminAccessDeniedAlert";

export default function RequireAdminUser({ children }: { children: ReactNode }) {
  const isAdmin = useAppSelector(selectCurrentUserIsAdmin);

  if (isAdmin) return children;

  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <AdminAccessDeniedAlert />
    </section>
  );
}
