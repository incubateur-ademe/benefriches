import { fr } from "@codegouvfr/react-dsfr";
import { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";
import { useEffect, useState } from "react";
import { Link } from "type-route";

import classNames from "@/shared/views/clsx";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";

import IllustrationCard from "./IllustrationCard";
import OnBoardingIntroductionStep from "./Step";
import { HOW_IT_WORKS_CONTENT } from "./content";

const TRANSITION_CLASSES = ["transition", "ease-in-out", "duration-1000"] as const;
const VISIBLE_CLASSES = ["opacity-100", "visible", "translate-y-0"] as const;
const INVISIBLE_CLASSES = ["md:opacity-0", "md:invisible", "md:translate-y-44"] as const;

type Props = {
  nextButtonProps: Partial<ButtonProps>;
  backLinkProps: Link;
};

const OnBoardingIntroductionHow = ({ nextButtonProps, backLinkProps }: Props) => {
  const { breakpointsValues } = useBreakpointsValuesPx();
  const { windowInnerWidth } = useWindowInnerSize();

  const shouldDisplayStepByStep = windowInnerWidth > breakpointsValues.md;

  const [step, setStep] = useState(shouldDisplayStepByStep ? 0 : 4);

  const step1Classes = step > 0 ? VISIBLE_CLASSES : INVISIBLE_CLASSES;
  const step2Classes = step > 1 ? VISIBLE_CLASSES : INVISIBLE_CLASSES;
  const step3Classes = step > 2 ? VISIBLE_CLASSES : INVISIBLE_CLASSES;
  const step4Classes = step > 3 ? VISIBLE_CLASSES : INVISIBLE_CLASSES;

  useEffect(() => {
    if (shouldDisplayStepByStep) {
      setTimeout(() => {
        setStep(1);
      }, 500);
    }
  }, [shouldDisplayStepByStep]);

  return (
    <>
      <HtmlTitle>Comment ça marche - Introduction</HtmlTitle>
      <section className={classNames(fr.cx("fr-container"), "py-20", "grid grid-cols-12 gap-2")}>
        <aside
          className={classNames(
            "col-span-12",
            "row-start-2",
            "md:row-start-1",
            "md:col-span-4",
            "grid",
            "grid-rows-3",
            "gap-12",
            "px-14",
          )}
          aria-hidden="true"
        >
          <div className={classNames("relative")}>
            <IllustrationCard
              title="Votre site"
              iconId="fr-icon-map-pin-2-fill"
              stepNumber={1}
              className={["w-[60%]", TRANSITION_CLASSES, step1Classes]}
            />
            <IllustrationCard
              title="Votre projet"
              iconId="fr-icon-briefcase-fill"
              stepNumber={2}
              className={[
                "w-[60%]",
                TRANSITION_CLASSES,
                step2Classes,
                "absolute",
                "right-0",
                "bottom-4",
                "z-10",
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
              "before:content-['x']",
              "before:absolute",
              "before:-top-12",
              "before:left-[50%]",
              "before:text-3xl",
              "before:font-bold",
            ]}
          >
            <div className="flex gap-4 items-center">
              <img src="/img/logos/logo-ademe.svg" alt="ADEME" className="h-10" />
              <img src="/img/logos/logo-insee.svg" alt="INSEE" className="h-10" />
              <img src="/img/logos/logo-aldo.svg" alt="Aldo" className="h-6" />
            </div>
          </IllustrationCard>
          <IllustrationCard
            title="Impacts de votre projet"
            iconId="fr-icon-bar-chart-box-fill"
            stepNumber={4}
            className={[
              TRANSITION_CLASSES,
              step4Classes,
              "mt-2",
              "before:content-['=']",
              "before:absolute",
              "before:-top-12",
              "before:left-[50%]",
              "before:text-3xl",
              "before:font-bold",
            ]}
          >
            <span className="text-sm">
              🌱 Environnement, 👷 Emploi, 🤕 Sécurité, 💰 Finances publiques...
            </span>
          </IllustrationCard>
        </aside>

        <div className="col-span-12 md:col-span-8">
          <h2>Bénéfriches, comment ça marche&nbsp;?</h2>
          <OnBoardingIntroductionStep
            stepNumber={1}
            className={[TRANSITION_CLASSES, step1Classes]}
            title={HOW_IT_WORKS_CONTENT.DESCRIBE_SITE_TITLE}
            text={HOW_IT_WORKS_CONTENT.DESCRIBE_SITE_TEXT}
          />

          <OnBoardingIntroductionStep
            stepNumber={2}
            className={[TRANSITION_CLASSES, step2Classes]}
            title={HOW_IT_WORKS_CONTENT.DESCRIBE_PROJECT_TITLE}
            text={HOW_IT_WORKS_CONTENT.DESCRIBE_PROJECT_TEXT}
          />

          <OnBoardingIntroductionStep
            stepNumber={3}
            className={[TRANSITION_CLASSES, step3Classes]}
            title={HOW_IT_WORKS_CONTENT.BENEFRICHES_COMPUTING_TITLE}
            text={HOW_IT_WORKS_CONTENT.BENEFRICHES_COMPUTING_TEXT}
          />

          <OnBoardingIntroductionStep
            stepNumber={4}
            className={[TRANSITION_CLASSES, step4Classes]}
            title={HOW_IT_WORKS_CONTENT.VIEW_IMPACTS_TITLE}
            text={HOW_IT_WORKS_CONTENT.VIEW_IMPACTS_TEXT}
          />

          <ButtonsGroup
            inlineLayoutWhen="always"
            alignment="between"
            className="mt-8"
            buttons={[
              {
                children: "Retour",
                priority: "secondary",
                linkProps: backLinkProps,
              },
              {
                priority: "primary",
                ...(step === 4
                  ? {
                      children: "C'est parti",
                      nativeButtonProps: {
                        role: "link",
                        type: "button",
                        ...nextButtonProps,
                      },
                    }
                  : {
                      children: "Suivant",
                      nativeButtonProps: {
                        type: "button",
                        onClick: () => {
                          setStep((current) => current + 1);
                        },
                      },
                    }),
              },
            ]}
          />
        </div>
      </section>
    </>
  );
};

export default OnBoardingIntroductionHow;
