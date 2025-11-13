import Button from "@codegouvfr/react-dsfr/Button";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { useState } from "react";
import { SiteNature } from "shared";

import { appSettingUpdated, selectAppSettings } from "@/features/app-settings/core/appSettings";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  siteNature: SiteNature;
};

export default function ExpressSiteDisclaimer({ siteNature }: Props) {
  const dispatch = useAppDispatch();
  const { displayExpressSiteDisclaimer } = useAppSelector(selectAppSettings);
  const [dismissable, setDismissable] = useState(false);

  const onDismiss = () => {
    dispatch(appSettingUpdated({ field: "displayExpressSiteDisclaimer", value: false }));
  };

  if (!displayExpressSiteDisclaimer) return null;

  return (
    <section className="bg-warning-ultralight p-6 rounded-lg mb-4">
      <h3 className="text-xl mb-4">
        Comment ont été affectées les caractéristiques de{" "}
        {siteNature === "FRICHE" ? "ma friche" : "mon site"} ?
      </h3>
      <p className="mb-4">
        Bénéfriches a <strong>automatiquement complété les caractéristiques manquantes</strong>{" "}
        (typologie des sols, bâtiments, gestion et sécurisation de la friche, etc.) Bénéfriches se
        base pour cela sur les valeurs représentatives pour ce type de{" "}
        {siteNature === "FRICHE" ? "friche" : "site"} sur la{" "}
        <strong>localisation géographique</strong> que vous avez renseigné.
      </p>
      <Checkbox
        className="text-sm mb-6"
        options={[
          {
            label: "J'ai compris",
            nativeInputProps: {
              defaultChecked: dismissable,
              value: "expressSiteDisclaimerDismissable",
              onChange: (ev) => {
                setDismissable(ev.target.checked);
              },
            },
          },
        ]}
      />
      <Button priority="secondary" onClick={onDismiss} disabled={!dismissable}>
        Masquer ce message
      </Button>
    </section>
  );
}
