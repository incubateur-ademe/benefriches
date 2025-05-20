import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";

import classNames, { ClassValue } from "@/shared/views/clsx";
import CheckboxCard from "@/shared/views/components/CheckboxCard/CheckboxCard";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";

import ImpactComparisonCardContent from "./ImpactComparisonCardContent";

type Props = {
  userCompareImpactsAlerts?: Option[];
  onSaveLoadingState: "idle" | "loading" | "error" | "success";
  onSubmit: (formData: FormValues) => void;
  userEmail?: string;
};

type Option =
  | "same_project_on_agricultural_operation"
  | "same_project_on_prairie"
  | "statu_quo_scenario";

type FormValues = {
  email: string;
  options: Option[];
};

const SuccessDisabledButton = () => (
  <Button
    size="small"
    priority="secondary"
    disabled
    iconId="fr-icon-check-line"
    className="!tw-text-dsfr-titleBlue !tw-shadow-none"
  >
    Vous serez notifié·e
  </Button>
);

const DIALOG_ID = "fr-comparison-alerts-modal";

const StatuQuoContent = () => {
  return (
    <ImpactComparisonCardContent
      title="Si le projet ne se fait pas"
      imgSrc="/img/pictograms/site-nature/friche.svg"
      descriptionItems={[
        "💥 Des accidents sur la friche qui risquent de survenir",
        "💰 Des mesures de sécurisation de la friche de plus en plus coûteuses",
        "🏚️ Un cadre de vie déplaisant pour les riverains",
        "Et pleins d’autres impacts.",
      ]}
    />
  );
};

const ProjectOnAgriculturalOperation = () => {
  return (
    <ImpactComparisonCardContent
      title="Ce projet sur une exploitation agricole"
      imgSrc="/img/pictograms/site-nature/agricultural-operation.svg"
      descriptionItems={[
        "👨‍🌾 Des emplois agricoles détruits",
        "🍂 Des sols qui absorberont moins d’eau et moins de carbone",
        "💥 Des accidents sur la friche qui risquent de survenir",
        "Et pleins d’autres impacts.",
      ]}
    />
  );
};

const ProjectOnNaturalArea = () => {
  return (
    <ImpactComparisonCardContent
      title="Ce projet sur une prairie"
      imgSrc="/img/pictograms/site-nature/natural-area.svg"
      descriptionItems={[
        "🚧 Des dépenses de construction et de VRD élevées",
        "🥀 Une biodiversité dégradée",
        "🍂 Des sols qui absorberont moins d’eau et moins de carbone",
        "Et pleins d’autres impacts.",
      ]}
    />
  );
};

const COMPARE_OPTIONS: { option: Option; bgClassName: ClassValue; content: ReactNode }[] = [
  {
    option: "statu_quo_scenario",
    bgClassName: "tw-bg-[#E4D8E4] dark:tw-bg-[#3a283b]",
    content: <StatuQuoContent />,
  },
  {
    option: "same_project_on_agricultural_operation",
    bgClassName: "tw-bg-[#E4E4D7] dark:tw-bg-[#4a4b2e]",
    content: <ProjectOnAgriculturalOperation />,
  },
  {
    option: "same_project_on_prairie",
    bgClassName: "tw-bg-[#D9E7DA] dark:tw-bg-[#355737]",
    content: <ProjectOnNaturalArea />,
  },
] as const;

function ImpactComparisonSection({
  userCompareImpactsAlerts = [],
  onSubmit,
  onSaveLoadingState,
  userEmail,
}: Props) {
  const { handleSubmit, register, formState, control, setValue } = useForm<FormValues>({
    defaultValues: { email: userEmail, options: userCompareImpactsAlerts },
  });

  const isSuccess = onSaveLoadingState === "success";

  return (
    <>
      <div className="tw-mb-8 tw-py-4 tw-grid tw-grid-flow-col tw-grid-cols-[75%_repeat(3,373px)] sm:tw-grid-cols-[25%_repeat(3,373px)] tw-gap-10 tw-overflow-x-scroll">
        <div className="tw-bg-impacts-dark dark:tw-bg-black tw-p-6 tw-rounded-2xl tw-justify-center tw-flex tw-flex-col tw-gap-4 tw-font-bold">
          <span className="tw-text-3xl">Le saviez-vous ?</span>
          <span className="tw-text-xl">
            Ce projet sur cette friche aura des impacts socio-économiques bien meilleurs que...
          </span>
        </div>
        {COMPARE_OPTIONS.map(({ option, bgClassName, content }) => (
          <div
            key={option}
            className={classNames(
              bgClassName,
              "tw-p-6",
              "tw-rounded-2xl",
              "tw-flex tw-flex-col tw-justify-around",
            )}
          >
            {content}
            {userCompareImpactsAlerts.includes(option) ? (
              <SuccessDisabledButton />
            ) : isSuccess ? null : (
              <Button
                size="small"
                priority="secondary"
                data-fr-opened="false"
                aria-controls={DIALOG_ID}
                onClick={() => {
                  setValue("options", [...userCompareImpactsAlerts, option]);
                }}
              >
                Comparer
              </Button>
            )}
          </div>
        ))}
      </div>

      <dialog
        aria-labelledby={`${DIALOG_ID}-title`}
        id={DIALOG_ID}
        className={classNames(fr.cx("fr-modal", "fr-modal--opened"), "tw-overflow-auto", "tw-z-40")}
      >
        <div
          className={classNames(
            fr.cx("fr-container", "fr-container--fluid", "fr-container-md"),
            isSuccess && "md:tw-w-5/12",
          )}
        >
          <div
            className={classNames(
              fr.cx("fr-modal__body"),
              "!tw-max-h-[unset]",
              "tw-overflow-hidden",
            )}
          >
            <div className={fr.cx("fr-modal__header")}>
              <button
                className={fr.cx("fr-btn--close", "fr-btn")}
                aria-controls={DIALOG_ID}
                type="button"
              >
                Fermer
              </button>
            </div>
            <div className={fr.cx("fr-modal__content")}>
              <h1 className={fr.cx("fr-modal__title")} id={`${DIALOG_ID}-title`}>
                {isSuccess ? (
                  <i className="fr-icon--xl fr-icon-success-fill tw-pr-2 tw-text-impacts-positive-border"></i>
                ) : (
                  "Cette fonctionnalité sera bientôt disponible, restez notifié·e !"
                )}
              </h1>
              {isSuccess ? (
                <>Votre demande a bien été prise en compte&nbsp;!</>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="tw-grid md:tw-grid-cols-3 tw-gap-4 tw-mb-6">
                    {COMPARE_OPTIONS.map(({ option, bgClassName, content }) => (
                      <Controller
                        key={option}
                        control={control}
                        name="options"
                        render={({ field }) => {
                          const isSelected = field.value.includes(option);
                          return (
                            <CheckboxCard
                              className={classNames(bgClassName, "tw-p-6", "tw-rounded-2xl")}
                              checked={isSelected}
                              checkType="checkbox"
                              disabled={userCompareImpactsAlerts.includes(option)}
                              onChange={() => {
                                field.onChange(
                                  isSelected
                                    ? field.value.filter((v) => v !== option)
                                    : [...field.value, option],
                                );
                              }}
                            >
                              {content}
                              {userCompareImpactsAlerts.includes(option) && (
                                <SuccessDisabledButton />
                              )}
                            </CheckboxCard>
                          );
                        }}
                      />
                    ))}
                  </div>

                  <p>Recevez un mail lorsque cette fonctionnalité sera disponible :</p>

                  <Input
                    label={<RequiredLabel label="Votre adresse mail" />}
                    state={formState.errors.email ? "error" : "default"}
                    stateRelatedMessage={
                      formState.errors.email ? formState.errors.email.message : undefined
                    }
                    nativeInputProps={{
                      placeholder: "utilisateur@ademe.fr",
                      ...register("email", {
                        required: "Vous devez renseigner votre e-mail pour continuer.",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Veuillez entrer une adresse email valide.",
                        },
                      }),
                    }}
                  />
                  {onSaveLoadingState === "error" && (
                    <Alert
                      description="Une erreur s'est produite lors de la sauvegarde des données... Veuillez réessayer."
                      severity="error"
                      title="Échec de l'enregistrement"
                      className="tw-my-7"
                    />
                  )}
                  <div className="tw-flex tw-justify-end">
                    <Button
                      type="submit"
                      disabled={onSaveLoadingState === "loading" || !formState.isValid}
                      iconId="fr-icon-notification-3-line"
                    >
                      {onSaveLoadingState === "loading" ? "Chargement..." : "Me notifier"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default ImpactComparisonSection;
