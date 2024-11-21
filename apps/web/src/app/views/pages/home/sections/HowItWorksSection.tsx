import IllustrationCard from "@/features/onboarding/how-it-works/IllustrationCard";
import OnBoardingIntroductionStep from "@/features/onboarding/how-it-works/Step";
import { HOW_IT_WORKS_CONTENT } from "@/features/onboarding/how-it-works/content";
import classNames from "@/shared/views/clsx";

export default function HowItWorksSection() {
  return (
    <section className="tw-py-20 tw-bg-grey-light dark:tw-bg-grey-dark">
      <div className="fr-container tw-grid tw-grid-cols-12 tw-gap-8">
        <div
          className={classNames(
            "tw-col-span-12 tw-row-start-2",
            "md:tw-row-start-1 md:tw-col-span-4",
            "tw-grid tw-grid-rows-3 tw-gap-10",
            "tw-px-14",
          )}
        >
          <div className="tw-relative">
            <IllustrationCard
              title="Votre site"
              iconId="fr-icon-map-pin-2-fill"
              stepNumber={1}
              className="tw-w-[60%]"
            />
            <IllustrationCard
              title="Votre projet"
              iconId="fr-icon-briefcase-fill"
              stepNumber={2}
              className={["tw-w-[60%]", "tw-absolute", "tw-right-0", "tw-bottom-4", "tw-z-10"]}
            />
          </div>
          <div className="tw-flex tw-flex-col tw-justify-center">
            <IllustrationCard
              title="Données Bénéfriches"
              iconId="fr-icon-database-fill"
              stepNumber={3}
              className={[
                "tw-translate-y-0",
                "before:tw-content-['x']",
                "before:tw-absolute",
                "before:tw-top-[-3.5rem]",
                "before:tw-left-[50%]",
                "before:tw-text-3xl",
                "before:tw-font-bold",
              ]}
            />
          </div>
          <IllustrationCard
            title="Impacts de votre projet"
            iconId="fr-icon-bar-chart-box-fill"
            stepNumber={4}
            className={[
              "tw-translate-y-0",
              "before:tw-content-['=']",
              "before:tw-absolute",
              "before:tw-top-[-3.5rem]",
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
            title={HOW_IT_WORKS_CONTENT.DESCRIBE_SITE_TITLE}
            text={HOW_IT_WORKS_CONTENT.DESCRIBE_SITE_TEXT}
          />

          <OnBoardingIntroductionStep
            stepNumber={2}
            title={HOW_IT_WORKS_CONTENT.DESCRIBE_PROJECT_TITLE}
            text={HOW_IT_WORKS_CONTENT.DESCRIBE_PROJECT_TEXT}
          />

          <OnBoardingIntroductionStep
            stepNumber={3}
            title={HOW_IT_WORKS_CONTENT.BENEFRICHES_COMPUTING_TITLE}
            text={HOW_IT_WORKS_CONTENT.BENEFRICHES_COMPUTING_TEXT}
          />

          <OnBoardingIntroductionStep
            stepNumber={4}
            title={HOW_IT_WORKS_CONTENT.VIEW_IMPACTS_TITLE}
            text={HOW_IT_WORKS_CONTENT.VIEW_IMPACTS_TEXT}
          />
        </div>
      </div>
    </section>
  );
}
