import Button from "@codegouvfr/react-dsfr/Button";
import ExampleArticle from "./Example";

type Props = {
  onNextClick: () => void;
};

export default function Step2({ onNextClick }: Props) {
  return (
    <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-space-x-6">
      <div className="tw-m-auto md:tw-m-0">
        <img
          src="/img/pictograms/project-impacts-onboarding/beneficiaries.svg"
          aria-hidden="true"
          alt="pictogramme bénéficiaires des impacts"
          width="384px"
        />
      </div>
      <div>
        <h1 className="tw-text-[32px]">
          Votre projet aura un impact réel sur de{" "}
          <span className="tw-bg-[#E180A080]">nombreuses personnes</span>.
        </h1>
        <p className="tw-text-lg tw-font-bold">Par exemple :</p>
        <section className="tw-my-6 tw-flex tw-flex-col lg:tw-flex-row lg:tw-space-x-6">
          <ExampleArticle
            name="La société française"
            emoji="🇫🇷"
            text=" La société française regroupe l'état français, ses acteurs économiques et sa
              population. Ils peuvent être indirectement affectés par certains dispositifs du projet
              (les accidents de la route évités, les foyers alimentés par les énergies
              renouvelables...)."
          />
          <ExampleArticle
            name="La société humaine"
            emoji="🌍"
            text="La société humaine représente l'ensemble des habitants de la planète. Ceux-ci
              bénéficient indirectement des impacts du projet sur l'environnement (réduction des
              émissions de gaz à effet de serre, amélioration des services écosystémiques...)."
            arrowDirection="left"
            className="md:tw-mt-14"
          />
        </section>
        <p>
          Mais aussi la collectivité, les riverains, les structures locales, les futurs habitants...
        </p>
        <div className="tw-flex tw-flex-row-reverse tw-mt-5">
          <Button onClick={onNextClick}>Suivant (2/3)</Button>
        </div>
      </div>
    </div>
  );
}
