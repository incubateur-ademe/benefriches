import { useEffect } from "react";

import { BENEFRICHES_ENV } from "@/shared/views/envVars";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { routes } from "@/shared/views/router";

import { MutafrichesEvaluationEvent } from "./mutafriches.types";

export default function EvaluateMutabilityPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleMessage = (event: MessageEvent<MutafrichesEvaluationEvent>) => {
      // only handle messages from Mutafriches
      if (event.origin !== BENEFRICHES_ENV.mutafrichesUrl) {
        // eslint-disable-next-line no-console
        console.warn("Ignored message from:", event.origin);
        return;
      }

      const { type, data } = event.data;

      switch (type) {
        case "mutafriches:completed":
          routes.fricheMutabilityResults({ evaluationId: data.evaluationId }).push();
          break;
        default:
          break;
      }
      window.scrollTo(0, 0);
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [dispatch]);

  return (
    <section className="py-10">
      <h1 className="fr-container">Analyse de la compatibilité de la friche</h1>
      <iframe
        width="100%"
        height="950px"
        src={`${BENEFRICHES_ENV.mutafrichesUrl}?integrator=${BENEFRICHES_ENV.mutafrichesIntegrator}&callbackUrl=${encodeURIComponent(
          `${window.location.origin}/callback`,
        )}&callbackLabel=${encodeURIComponent("Retour vers Bénéfriches")}`}
        title="Explorer la compatibilité de ma friche"
      />
      )
    </section>
  );
}
