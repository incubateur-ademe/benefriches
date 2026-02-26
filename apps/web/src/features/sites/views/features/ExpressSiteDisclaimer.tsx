import { SiteNature } from "shared";

import { expressSiteDisclaimerHidden } from "@/features/analytics/core/analyticsEvents";
import { eventTracked } from "@/features/analytics/core/eventTracked.action";
import { appSettingUpdated, selectAppSettings } from "@/features/app-settings/core/appSettings";
import Disclaimer from "@/shared/views/components/Disclaimer/Disclaimer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  siteNature: SiteNature;
};

export default function ExpressSiteDisclaimer({ siteNature }: Props) {
  const dispatch = useAppDispatch();
  const { displayExpressSiteDisclaimer } = useAppSelector(selectAppSettings);

  const onDismiss = () => {
    void dispatch(eventTracked(expressSiteDisclaimerHidden()));
    dispatch(appSettingUpdated({ field: "displayExpressSiteDisclaimer", value: false }));
  };

  if (!displayExpressSiteDisclaimer) return null;

  const siteTypeLabel = siteNature === "FRICHE" ? "friche" : "site";

  const title = `Comment ont été affectées les caractéristiques de ${siteNature === "FRICHE" ? "ma friche" : "mon site"} ?`;

  return (
    <Disclaimer title={title} onDismiss={onDismiss}>
      Bénéfriches a <strong>automatiquement complété les caractéristiques manquantes</strong>{" "}
      (typologie des sols, bâtiments, gestion et sécurisation de la friche, etc.) Bénéfriches se
      base pour cela sur les valeurs représentatives pour ce type de {siteTypeLabel} sur la{" "}
      <strong>localisation géographique</strong> que vous avez renseigné.
    </Disclaimer>
  );
}
