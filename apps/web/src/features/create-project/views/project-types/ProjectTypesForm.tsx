import { Controller, useForm } from "react-hook-form";
import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { DevelopmentPlanCategory, developmentPlanCategorySchema } from "../../domain/project.types";
import DevelopmentPlanCategoryTile from "./DevelopmentPlanCategoryTile";

import AboutFormsModal from "@/shared/app-settings/views/AboutFormsModal";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  allowedDevelopmentPlanCategories: DevelopmentPlanCategory[];
};

type FormValues = {
  developmentPlanCategory: DevelopmentPlanCategory;
};

function ProjectTypesForm({ onSubmit, allowedDevelopmentPlanCategories }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>();
  const validationError = formState.errors.developmentPlanCategory;

  const options = developmentPlanCategorySchema.options.map((option) => {
    return {
      value: option,
      disabled: !allowedDevelopmentPlanCategories.includes(option),
    };
  });

  return (
    <>
      <AboutFormsModal />
      <WizardFormLayout title="Que souhaitez-vous aménager sur ce site ?">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={fr.cx("fr-mb-5w")}>
            <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
              {options.map(({ value, disabled }) => {
                return (
                  <div className={fr.cx("fr-col-12", "fr-col-sm-6")} key={value}>
                    <Controller
                      control={control}
                      name="developmentPlanCategory"
                      rules={{ required: "Veuillez sélectionner un type d'aménagement." }}
                      render={({ field }) => {
                        const isSelected = field.value === value;
                        return (
                          <DevelopmentPlanCategoryTile
                            developmentPlanCategory={value}
                            disabled={disabled}
                            isSelected={isSelected}
                            onSelect={() => {
                              field.onChange(value);
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                );
              })}
            </div>
            {validationError && <p className={fr.cx("fr-error-text")}>{validationError.message}</p>}
          </div>
          <Button className="tw-float-right" nativeButtonProps={{ type: "submit" }}>
            Suivant
          </Button>
        </form>
      </WizardFormLayout>
    </>
  );
}

export default ProjectTypesForm;
