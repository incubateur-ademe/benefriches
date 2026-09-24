import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import type { ReactNode } from "react";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { selectCurrentUserIsAdmin } from "@/features/onboarding/core/user.reducer";

export default function RequireAdminUser({ children }: { children: ReactNode }) {
  const isAdmin = useAppSelector(selectCurrentUserIsAdmin);

  if (isAdmin) return children;

  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <Alert
        severity="warning"
        title="Accès réservé aux administrateurs"
        description="Vous n'avez pas les droits nécessaires pour accéder à cette page."
      />
    </section>
  );
}
