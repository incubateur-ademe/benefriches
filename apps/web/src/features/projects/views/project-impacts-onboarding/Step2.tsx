import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import ExampleArticle from "./Example";

type Props = {
  onBackClick: () => void;
  onNextClick: () => void;
};

export default function Step2({ onNextClick, onBackClick }: Props) {
  return (
    <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-space-x-6 tw-items-start">
      <img
        src="/img/pictograms/project-impacts-onboarding/beneficiaries.svg"
        aria-hidden="true"
        alt="pictogramme bénéficiaires des impacts"
        className="tw-w-1/2 md:tw-w-1/3 tw-mx-auto"
      />
      <div className="md:tw-w-2/3">
        <h1 className="tw-text-[32px]">
          Votre projet aura un impact réel sur de{" "}
          <span className="tw-bg-[#E180A080]">nombreuses personnes</span>.
        </h1>
        <p className="tw-text-lg tw-font-bold">Par exemple :</p>
        <section className="tw-my-6 tw-flex tw-flex-col lg:tw-flex-row lg:tw-space-x-6">
          <ExampleArticle
            name="La société française"
            emoji="🇫🇷"
            text="La société française regroupe l’état français, ses acteurs économiques et sa population. Ils peuvent être indirectement affectés par le projet (accidents de la route évités, dépenses de santé évitées...)"
          />
          <ExampleArticle
            name="L'humanité"
            emoji="🌍"
            text="L'humanité représente l’ensemble des habitants de la planète. Ceux-ci bénéficient indirectement des impacts du projet sur l’environnement (réduction des émissions de gaz à effet de serre, maintien de la biodiversité...)."
            arrowDirection="left"
            className="md:tw-mt-14"
          />
        </section>
        <p>
          Mais aussi la collectivité, les riverains, les structures locales, les futurs habitants...
        </p>
        <div className="tw-mt-5">
          <ButtonsGroup
            inlineLayoutWhen="always"
            alignment="between"
            buttons={[
              {
                children: "Retour",
                priority: "secondary",
                onClick: onBackClick,
              },
              {
                priority: "primary",
                children: "Suivant (2/4)",
                onClick: onNextClick,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
