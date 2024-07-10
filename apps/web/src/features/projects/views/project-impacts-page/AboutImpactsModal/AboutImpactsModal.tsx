import { useEffect, useState } from "react";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { createModal } from "@codegouvfr/react-dsfr/Modal";

import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

const modal = createModal({
  id: "about-benefriches-impacts-modal",
  isOpenedByDefault: false,
});

type StopDisplayingModalCheckboxProps = {
  checked: boolean;
  onChange: () => void;
};

function StopDisplayingModalCheckbox({ checked, onChange }: StopDisplayingModalCheckboxProps) {
  return (
    <Checkbox
      options={[
        {
          label: "Ne plus afficher ce message",
          nativeInputProps: {
            name: "stop-displaying-message",
            checked,
            onChange,
          },
        },
      ]}
    />
  );
}

const SectionTitle = ({ children }: { children: string }) => {
  return <h3 className="tw-text-base tw-mb-1">{children}</h3>;
};

type Props = {
  shouldOpenModal: boolean;
  setShouldNotDisplayAgain: (value: boolean) => void;
};

function AboutImpactsModal({ shouldOpenModal, setShouldNotDisplayAgain }: Props) {
  const [shouldStopDisplayingModal, setShouldStopDisplayingModal] = useState(false);

  useEffect(() => {
    if (shouldOpenModal) {
      setTimeout(() => {
        modal.open();
      }, 150);
    }
  }, [shouldOpenModal]);

  return (
    <modal.Component
      title="À propos de la page impacts du projet"
      buttons={[
        {
          children: "Découvrir les impacts",
          type: "button",
        },
      ]}
    >
      <section className="tw-mb-4">
        <SectionTitle>📊 Les indicateurs sont calculés à partir de données sourcées</SectionTitle>
        <p className="tw-mb-2">
          Vous trouverez dans cette page des indicateurs d'impacts économiques, sociaux et
          environnementaux (voire certains combinant les 2 premiers aspects), calculés à partir des
          données que vous avez saisies (ex : les surfaces des différents types de sol ou encore la
          quantité d'énergie renouvelable qui sera produite annuellement) et :
        </p>
        <ul>
          <li>
            de valeurs de référence compilées dans Bénéfriches à partir de publications sourcées
            (INSEE, France Stratégie, AGRESTE, ADEME, publications scientifiques, etc.)
          </li>
          <li>
            et/ou de bases de données accessible en{" "}
            <ExternalLink href="https://www.data.gouv.fr/fr/">opendata</ExternalLink> (dvf, etc.)
          </li>
          <li>
            et/ou d'hypothèses contextualisées (ex : temps de déplacement gagné par les habitants du
            fait de la création d'une nouvelle centralité à partir des données de l'
            <ExternalLink href="https://www.observatoire-des-territoires.gouv.fr/">
              Observatoire des territoires
            </ExternalLink>
            ).
          </li>
        </ul>
      </section>
      <section className="tw-mb-4">
        <SectionTitle>
          💰 Les indicateurs monétaires ne tiennent pas encore compte du coefficient d'actualisation
        </SectionTitle>
        <p>Ce sera le cas dans une prochaine version de l'outil.</p>
      </section>
      <section className="tw-mb-4">
        <SectionTitle>⚖️ Les indicateurs affichent la valeur différentielle</SectionTitle>
        <p>
          Dans cette page, les indicateurs monétarisés ne montrent pas une comparaison ni un état
          final mais un différentiel. C'est-à-dire la valeur issue de la monétarisation des impacts,
          en plus (bénéfices) ou en moins (dommages) que le projet va générer par rapport à la
          conservation du site dans son état.
        </p>
      </section>
      <section>
        <SectionTitle>💾 Cette page est consultable à tout moment</SectionTitle>
        <p>Vous pouvez la retrouver dans votre espace "Mes projets"</p>
      </section>
      <StopDisplayingModalCheckbox
        checked={shouldStopDisplayingModal}
        onChange={() => {
          setShouldStopDisplayingModal(!shouldStopDisplayingModal);
          setShouldNotDisplayAgain(!shouldStopDisplayingModal);
        }}
      />
    </modal.Component>
  );
}

export default AboutImpactsModal;
