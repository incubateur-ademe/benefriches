import { fr } from "@codegouvfr/react-dsfr";
import { Controller, useForm } from "react-hook-form";

import classNames from "@/shared/views/clsx";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Badge from "@/shared/views/components/Badge/Badge";
import CheckboxCard from "@/shared/views/components/CheckboxCard/CheckboxCard";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues: Partial<FormValues>;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = {
  useMutability: "yes" | "no";
};

const UseMutabilityForm = ({ initialValues, onSubmit, onBack }: Props) => {
  const { handleSubmit, formState, control } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  return (
    <WizardFormLayout title="Que souhaitez-vous évaluer ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-10">
          <div className="grid md:grid-cols-2 gap-4">
            <Controller
              control={control}
              name="useMutability"
              rules={{ required: "Veuillez sélectionner un type d'évaluation." }}
              render={({ field }) => {
                return (
                  <CheckboxCard
                    className="rounded-lg h-full"
                    checked={field.value === "yes"}
                    onChange={() => {
                      field.onChange("yes");
                    }}
                  >
                    <div className="p-8 flex flex-col gap-2">
                      <img
                        src="/img/pictograms/evaluations/mutability.svg"
                        width="120px"
                        height="120px"
                        alt=""
                        aria-hidden="true"
                        className={"mb-2"}
                      />
                      <span className="text-sm">Je souhaite évaluer...</span>
                      <span className={classNames("text-xl", "font-bold")}>
                        La compatibilité de ma friche avec des projets potentiels
                      </span>
                      <legend className={fr.cx("fr-text--sm", "fr-mb-0")}>
                        <ul className="list-['✓'] marker:text-base">
                          <li>Nombreuses données pré-remplies grâce à la parcelle de la friche</li>
                          <li>7 projets potentiels analysés</li>
                          <li>Podium de compatibilité avec score en %</li>
                        </ul>
                        <Badge className="mt-3" style="mutability">
                          Adapté si vous avez juste une friche
                        </Badge>
                      </legend>
                    </div>
                  </CheckboxCard>
                );
              }}
            />
            <Controller
              control={control}
              name="useMutability"
              rules={{ required: "Veuillez sélectionner un type d'évaluation." }}
              render={({ field }) => {
                return (
                  <CheckboxCard
                    className="rounded-lg h-full"
                    checked={field.value === "no"}
                    onChange={() => {
                      field.onChange("no");
                    }}
                  >
                    <div className="p-8 flex flex-col gap-2">
                      <img
                        src="/img/pictograms/evaluations/impacts.svg"
                        width="120px"
                        height="120px"
                        alt=""
                        aria-hidden="true"
                        className={"mb-2"}
                      />
                      <span className="text-sm">Je souhaite évaluer...</span>
                      <span className={classNames("text-xl", "font-bold")}>
                        Les impacts socio-économiques d’un projet sur mon site
                      </span>
                      <legend className={fr.cx("fr-text--sm", "fr-mb-0")}>
                        <ul className="list-['✓'] marker:text-base">
                          <li>Nombreuses données pré-remplies grâce à l’adresse du site</li>
                          <li>Jusqu’à 90 indicateurs calculés sur une durée de 1 à 50 ans</li>
                          <li>Possibilité de comparer les impacts avec d’autres scénarii</li>
                        </ul>
                        <Badge className="mt-3" style="impacts">
                          Adapté si vous avez un site et un projet
                        </Badge>
                      </legend>
                    </div>
                  </CheckboxCard>
                );
              }}
            />
          </div>
        </div>
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
};

export default UseMutabilityForm;
