import IllustrationCard from "@/features/onboarding/views/pages/how-it-works/IllustrationCard";
import OnBoardingIntroductionStep from "@/features/onboarding/views/pages/how-it-works/Step";
import { HOW_IT_WORKS_CONTENT } from "@/features/onboarding/views/pages/how-it-works/content";
import classNames from "@/shared/views/clsx";

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-grey-light dark:bg-grey-dark">
      <div className="fr-container grid grid-cols-12 gap-8">
        <aside
          className={classNames(
            "col-span-12 row-start-2",
            "md:row-start-1 md:col-span-4",
            "grid grid-rows-3 gap-10",
            "px-14",
          )}
          aria-hidden="true"
        >
          <div className="relative">
            <IllustrationCard
              title="Votre site"
              iconId="fr-icon-map-pin-2-fill"
              stepNumber={1}
              className="w-[60%]"
            />
            <IllustrationCard
              title="Votre projet"
              iconId="fr-icon-briefcase-fill"
              stepNumber={2}
              className={["w-[60%]", "absolute", "right-0", "bottom-4", "z-10"]}
            />
          </div>
          <div className="flex flex-col justify-center">
            <IllustrationCard
              title="Données Bénéfriches"
              iconId="fr-icon-database-fill"
              stepNumber={3}
              className={[
                "translate-y-0",
                "before:content-['x']",
                "before:absolute",
                "before:top-[-3.5rem]",
                "before:left-[50%]",
                "before:text-3xl",
                "before:font-bold",
              ]}
            />
          </div>
          <IllustrationCard
            title="Impacts de votre projet"
            iconId="fr-icon-bar-chart-box-fill"
            stepNumber={4}
            className={[
              "translate-y-0",
              "before:content-['=']",
              "before:absolute",
              "before:top-[-3.5rem]",
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
