import { fr } from "@codegouvfr/react-dsfr";
import { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";
import { useEffect, useState } from "react";
import { Link } from "type-route";

import classNames from "@/shared/views/clsx";

import IllustrationCard from "./IllustrationCard";
import OnBoardingIntroductionStep from "./Step";

const TRANSITION_CLASSES = ["tw-transition", "tw-ease-in-out", "tw-duration-1000"] as const;
const VISIBLE_CLASSES = ["tw-opacity-100", "tw-visible", "tw-translate-y-0"] as const;
const INVISIBLE_CLASSES = ["md:tw-opacity-0", "md:tw-invisible", "md:tw-translate-y-44"] as const;

type Props = {
  nextLinkProps: Link;
  backLinkProps: Link;
};

const OnBoardingIntroductionHow = ({ nextLinkProps, backLinkProps }: Props) => {
  const { breakpointsValues } = useBreakpointsValuesPx();
  const { windowInnerWidth } = useWindowInnerSize();

  const shouldDisplayStepByStep = windowInnerWidth > breakpointsValues.md;

  const [step, setStep] = useState(shouldDisplayStepByStep ? 0 : 4);

  const step1Classes = step > 0 ? VISIBLE_CLASSES : INVISIBLE_CLASSES;
  const step2Classes = step > 1 ? VISIBLE_CLASSES : INVISIBLE_CLASSES;
  const step3Classes = step > 2 ? VISIBLE_CLASSES : INVISIBLE_CLASSES;
  const step4Classes = step > 3 ? VISIBLE_CLASSES : INVISIBLE_CLASSES;

  const nextButtonProps =
    step === 4
      ? {
          children: "C'est parti",
          linkProps: nextLinkProps,
        }
      : {
          children: "Suivant",
          nativeButtonProps: {
            type: "button",
            onClick: () => {
              setStep((current) => current + 1);
            },
          },
        };

  useEffect(() => {
    if (shouldDisplayStepByStep) {
      setTimeout(() => {
        setStep(1);
      }, 500);
    }
  }, [shouldDisplayStepByStep]);

  return (
    <section
      className={classNames(fr.cx("fr-container"), "tw-py-20", "tw-grid tw-grid-cols-12 tw-gap-2")}
    >
      <div
        className={classNames(
          "tw-col-span-12",
          "tw-row-start-2",
          "md:tw-row-start-1",
          "md:tw-col-span-4",
          "tw-grid",
          "tw-grid-rows-3",
          "tw-gap-12",
          "tw-px-14",
        )}
      >
        <div className={classNames("tw-relative")}>
          <IllustrationCard
            title="Votre site"
            iconId="fr-icon-map-pin-2-fill"
            stepNumber={1}
            className={["tw-w-[60%]", TRANSITION_CLASSES, step1Classes]}
          />
          <IllustrationCard
            title="Votre projet"
            iconId="fr-icon-briefcase-fill"
            stepNumber={2}
            className={[
              "tw-w-[60%]",
              TRANSITION_CLASSES,
              step2Classes,
              "tw-absolute",
              "tw-right-0",
              "tw-bottom-4",
              "tw-z-10",
            ]}
          />
        </div>
        <IllustrationCard
          title="Données Bénéfriches"
          iconId="fr-icon-database-fill"
          stepNumber={3}
          className={[
            TRANSITION_CLASSES,
            step3Classes,
            "before:tw-content-['x']",
            "before:tw-absolute",
            "before:tw-top-[-3rem]",
            "before:tw-left-[50%]",
            "before:tw-text-3xl",
            "before:tw-font-bold",
          ]}
        >
          <div className="tw-flex tw-gap-4 tw-items-center">
            <img src="/img/logos/logo-ademe.svg" alt="Logo de l'ADEME" height="40px" />
            <img src="/img/logos/logo-insee.svg" alt="Logo de l'INSEE" height="40px" />
            <img src="/img/logos/logo-aldo.svg" alt="Logo d'Aldo" height="24px" />
          </div>
        </IllustrationCard>
        <IllustrationCard
          title="Impacts de votre projet"
          iconId="fr-icon-bar-chart-box-fill"
          stepNumber={4}
          className={[
            TRANSITION_CLASSES,
            step4Classes,
            "tw-mt-2",
            "before:tw-content-['=']",
            "before:tw-absolute",
            "before:tw-top-[-3rem]",
            "before:tw-left-[50%]",
            "before:tw-text-3xl",
            "before:tw-font-bold",
          ]}
        >
          <span className="tw-text-sm">
            🌱 Environnement, 👷 Emploi, 🤕 Sécurité, 💰 Finances publiques...
          </span>
        </IllustrationCard>
      </div>

      <div className="tw-col-span-12 md:tw-col-span-8">
        <h2>Bénéfriches, comment ça marche&nbsp;?</h2>
        <OnBoardingIntroductionStep
          stepNumber={1}
          className={[TRANSITION_CLASSES, step1Classes]}
          title="Décrivez le site"
          text="Adresse, type de site, typologie des sols, pollution, gestion du site... Vous n’avez pas toutes les infos ? Pas de panique, Bénéfriches vous propose un mode express qui génère des données basées sur des moyennes."
        />

        <OnBoardingIntroductionStep
          stepNumber={2}
          className={[TRANSITION_CLASSES, step2Classes]}
          title="Renseignez le projet"
          text="Type de projet, usage des sols, dépenses et recettes, calendrier... là aussi, si vous n’avez pas l’info, Bénéfriches vous propose un mode express."
        />

        <OnBoardingIntroductionStep
          stepNumber={3}
          className={[TRANSITION_CLASSES, step3Classes]}
          title="Bénéfriches croise vos informations avec ses données"
          text="Instructions du gouvernement, enquêtes et statistiques, rapports institutionnels scientifiques... Au total, Bénéfriches mobilise plus de 50 sources."
        />

        <OnBoardingIntroductionStep
          stepNumber={4}
          className={[TRANSITION_CLASSES, step4Classes]}
          title="Consultez les impacts "
          text="Bénéfriches quantifie et monétarise l’ensemble des impacts de votre projet (sur l’environnement, l’emploi, la sécurité des personnes, le cadre de vie des riverains, les finances publiques...) Vous retrouverez ces résultats dans une page sauvegardée et exportable en PDF."
        />

        <ButtonsGroup
          inlineLayoutWhen="always"
          alignment="between"
          className="tw-mt-8"
          buttons={[
            {
              children: "Retour",
              priority: "secondary",
              linkProps: backLinkProps,
            },
            {
              priority: "primary",
              ...(nextButtonProps as ButtonProps),
            },
          ]}
        />
      </div>
    </section>
  );
};

export default OnBoardingIntroductionHow;
