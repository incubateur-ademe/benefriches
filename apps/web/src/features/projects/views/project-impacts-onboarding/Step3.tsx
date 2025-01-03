import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import ExampleArticle from "./Example";

type Props = {
  onBackClick: () => void;
  onNextClick: () => void;
};

export default function Step3({ onNextClick, onBackClick }: Props) {
  return (
    <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-space-x-6 tw-items-start">
      <img
        src="/img/pictograms/project-impacts-onboarding/monetary-gains.svg"
        aria-hidden="true"
        alt="pictogramme gains en nature monétarisés"
        className="tw-w-1/2 md:tw-w-1/3 tw-mx-auto"
      />
      <div className="md:tw-w-2/3">
        <h1 className="tw-text-[32px]">
          Votre projet générera des{" "}
          <span className="tw-bg-[#FFC72780]">gains en nature monétarisés</span>.
        </h1>
        <p className="tw-text-lg">
          Bénéfriches calcule tous les impacts de votre projet : économiques directs (ex :
          fiscalité), retombées (ex&nbsp;:&nbsp;↘️&nbsp;des dépenses de sécurisation d'un site),
          mais aussi les "gains en nature" monétarisés. Il s’agit d’effets non marchands ou
          "externalités" (ex&nbsp;:&nbsp;↘️&nbsp; des émissions carbone) auxquels il est possible
          d'attribuer une valeur monétaire.
        </p>
        <p className="tw-text-lg tw-font-bold">Par exemple :</p>
        <section className="tw-my-6">
          <ExampleArticle
            name="Valeur monétaire de la décarbonation"
            emoji="☁️"
            text="En produisant des EnR ou en réduisant les déplacements en voiture, le projet participe
              à la décarbonation. Cette action en faveur du climat a une valeur monétaire que
              Bénéfriches utilise dans ses calculs."
          />
        </section>
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
                children: "Suivant (3/4)",
                onClick: onNextClick,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
