import { useForm } from "react-hook-form";
import { fr } from "@codegouvfr/react-dsfr";

import { ProjectPhase, ProjectPhaseDetails } from "@/shared/domain/reconversionProject";
import classNames from "@/shared/views/clsx";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  phase: ProjectPhase;
  phaseDetails?: ProjectPhaseDetails;
};

const requiredMessage = "Veuillez sélectionner l'avancement du projet.";

function ProjectPhaseForm({ onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const selectedProjectPhase = watch("phase");

  return (
    <WizardFormLayout title="A quelle phase de votre projet êtes-vous ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset
          state={formState.errors.phase ? "error" : "default"}
          stateRelatedMessage={formState.errors.phase?.message ?? undefined}
        >
          <RadioButton
            label="Montage"
            value="setup"
            {...register("phase", { required: requiredMessage })}
          />
          {selectedProjectPhase === "setup" && (
            <div
              className={classNames(
                "tw-border-solid",
                "tw-border-0",
                "tw-border-l",
                "tw-border-dsfr-borderBlue",
                fr.cx("fr-pl-2w", "fr-ml-3v", "fr-pt-1w", "fr-my-1w"),
              )}
            >
              <RadioButton
                label="Opportunité de l'opération, identification et analyses de la faisabilité de différents scénarii possibles"
                value="setup_opportunity_and_feasibility_analysis"
                {...register("phaseDetails", { required: requiredMessage })}
              />
              <RadioButton
                label="Choix d'un scénario et du processus de sa mise en œuvre"
                value="setup_scenario_selection_and_implementation"
                {...register("phaseDetails", { required: requiredMessage })}
              />
            </div>
          )}
          <RadioButton
            label="Programme"
            value="planning"
            {...register("phase", { required: requiredMessage })}
          />
          <RadioButton
            label="Conception"
            value="design"
            {...register("phase", { required: requiredMessage })}
          />
          {selectedProjectPhase === "design" && (
            <div
              className={classNames(
                "tw-border-solid",
                "tw-border-0",
                "tw-border-l",
                "tw-border-dsfr-borderBlue",
                fr.cx("fr-pl-2w", "fr-ml-3v", "fr-pt-1w", "fr-my-1w"),
              )}
            >
              <RadioButton
                label="Esquisse / Avant-projet sommaire"
                value="design_preliminary_draft"
                {...register("phaseDetails", { required: requiredMessage })}
              />
              <RadioButton
                label="Avant-projet définitif"
                value="design_final_draft"
                {...register("phaseDetails", { required: requiredMessage })}
              />
              <RadioButton
                label="PRO / Dépôt permis / passation marchés"
                value="design_pro_or_permit_filing_or_contract_awarding"
                {...register("phaseDetails", { required: requiredMessage })}
              />
            </div>
          )}
          <RadioButton
            label="Réalisation / travaux"
            value="construction"
            {...register("phase", { required: requiredMessage })}
          />
          <RadioButton
            label="Projet réalisé"
            value="completed"
            {...register("phase", { required: requiredMessage })}
          />
          <RadioButton
            label="Ne sait pas"
            value="unknown"
            {...register("phase", { required: requiredMessage })}
          />
        </Fieldset>
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default ProjectPhaseForm;
