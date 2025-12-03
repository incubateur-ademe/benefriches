import { appSettingUpdated } from "@/features/app-settings/core/appSettings";
import { hideImpactsAccuracyDisclaimerClicked, trackEvent } from "@/shared/views/analytics";
import Disclaimer from "@/shared/views/components/Disclaimer/Disclaimer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

export default function ImpactsAccuracyDisclaimer() {
  const dispatch = useAppDispatch();

  const onDismiss = () => {
    trackEvent(hideImpactsAccuracyDisclaimerClicked());
    dispatch(appSettingUpdated({ field: "displayImpactsAccuracyDisclaimer", value: false }));
  };

  return (
    <Disclaimer title="⚠️ Attention, cette évaluation comporte des limites" onDismiss={onDismiss}>
      Bénéfriches a complété automatiquement certaines caractéristiques concernant votre friche
      et/ou votre projet d'aménagement. Les impacts calculés par l'outil peuvent ne pas refléter la
      réalité de votre friche ou de votre projet.
    </Disclaimer>
  );
}
