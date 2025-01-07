import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  decontaminationSelection: "partial" | "none" | "unknown" | null;
};

function SoilsDecontaminationSelection({ initialValues, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  return (
    <WizardFormLayout
      title="Est-il est nécessaire de dépolluer les sols&nbsp;?"
      instructions={
        <FormInfo>
          <p>
            La nécessité de dépolluer se détermine au moyen d'études, dans le respect de la doctrine
            national établie par le Ministère en charge de l'écologie. L'objectif est double :
          </p>
          <ul>
            <li>
              traiter les sols présentant des niveaux de concentrations en polluants anormalement
              importants
            </li>
            <li>
              atteindre un niveau de pollution résiduelle ne présentant pas de risques sanitaires
              pour les futurs usagers du projet.
            </li>
          </ul>
          <p>
            Si vous ne savez pas (encore) si le site doit être dépollué, Bénéfriches considérera
            qu'il est nécessaire de le faire au niveau moyen constaté sur les projets accompagnés
            par l'ADEME.
          </p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("decontaminationSelection")}
          options={[
            {
              label: "Oui",
              value: "partial",
            },
            {
              label: "Non",
              value: "none",
            },
            {
              label: "Ne sait pas",
              value: "unknown",
            },
          ]}
          error={formState.errors.decontaminationSelection}
        />
        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={watch("decontaminationSelection") !== null ? "Valider" : "Passer"}
        />
      </form>
    </WizardFormLayout>
  );
}

export default SoilsDecontaminationSelection;
