import Button from "@codegouvfr/react-dsfr/Button";
import { Controller, useForm } from "react-hook-form";
import { PROJECT_PHASE_VALUES, ProjectPhase } from "shared";

import {
  getHintTextForProjectPhase,
  getLabelForProjectPhase,
  getPictogramForProjectPhase,
} from "@/shared/core/projectPhase";
import HorizontalCheckableTile from "@/shared/views/components/CheckableTile/HorizontalCheckableTile";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues?: FormValues;
  onSubmit: (data: FormValues) => void;
};

type FormValues = {
  phase?: ProjectPhase;
};

const options = PROJECT_PHASE_VALUES.map((phase) => ({
  value: phase,
  label: getLabelForProjectPhase(phase),
  hintText: getHintTextForProjectPhase(phase),
  pictogram: getPictogramForProjectPhase(phase),
}));

type ProjectPhaseOptionProps = {
  label: string;
  hintText?: string;
  pictogram?: string;
  isSelected: boolean;
  onChange: () => void;
};

const ProjectPhaseOption = ({
  label,
  hintText,
  pictogram,
  isSelected,
  onChange,
}: ProjectPhaseOptionProps) => {
  return (
    <HorizontalCheckableTile
      title={label}
      description={hintText}
      imgSrc={pictogram}
      checked={isSelected}
      onChange={onChange}
      checkType="radio"
    />
  );
};

function ProjectPhaseForm({ initialValues, onSubmit }: Props) {
  const { handleSubmit, watch, control } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  return (
    <WizardFormLayout title="A quelle phase du projet êtes-vous ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        {options.map((option) => {
          return (
            <div key={option.value} className="mb-4">
              <Controller
                control={control}
                name="phase"
                render={({ field }) => {
                  const isSelected = field.value === option.value;
                  return (
                    <ProjectPhaseOption
                      label={option.label}
                      pictogram={option.pictogram}
                      hintText={option.hintText}
                      isSelected={isSelected}
                      onChange={() => {
                        field.onChange(option.value);
                      }}
                    />
                  );
                }}
              />
            </div>
          );
        })}
        <Button className="float-right" type="submit">
          {watch("phase") ? "Valider" : "Passer"}
        </Button>
      </form>
    </WizardFormLayout>
  );
}

export default ProjectPhaseForm;
