import { Controller, useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import HorizontalCheckableTile from "@/shared/views/components/CheckableTile/HorizontalCheckableTile";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props<T> = {
  projectPhaseOptions: { value: T; label: string; hintText?: string; pictogram?: string }[];
  onSubmit: (data: FormValues<T>) => void;
  onBack: () => void;
};

type FormValues<T> = {
  phase?: T;
};

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

function ProjectPhaseForm<TProjectPhase extends string>({
  projectPhaseOptions,
  onSubmit,
  onBack,
}: Props<TProjectPhase>) {
  const { handleSubmit, watch, control } = useForm<FormValues<TProjectPhase>>();

  return (
    <WizardFormLayout title="A quelle phase du projet êtes-vous ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        {projectPhaseOptions.map((option) => {
          return (
            <div key={option.value} className="tw-mb-4">
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
        <BackNextButtonsGroup onBack={onBack} nextLabel={watch("phase") ? "Valider" : "Passer"} />
      </form>
    </WizardFormLayout>
  );
}

export default ProjectPhaseForm;
