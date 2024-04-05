import { Controller, useForm } from "react-hook-form";
import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { DevelopmentPlanCategory } from "../../domain/project.types";
import DevelopmentPlanCategoryTile from "./DevelopmentPlanCategoryTile";

import AboutFormsModal from "@/shared/app-settings/views/AboutFormsModal";
import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type FormValues = {
  developmentPlanCategories: DevelopmentPlanCategory[];
};

const options: Record<DevelopmentPlanCategory, { disabled: boolean }> = {
  RENEWABLE_ENERGY: { disabled: false },
  BUILDINGS: { disabled: true },
  NATURAL_URBAN_SPACES: { disabled: true },
  URBAN_AGRICULTURE: { disabled: true },
  COMMERCIAL_ACTIVITY_AREA: { disabled: true },
};

function ProjectTypesForm({ onSubmit }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { developmentPlanCategories: [] },
  });
  const validationError = formState.errors.developmentPlanCategories;

  return (
    <>
      <AboutFormsModal />
      <WizardFormLayout title="Que souhaitez-vous aménager sur ce site ?">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-mb-5w")}>
            {typedObjectKeys(options).map((developmentPlanCategory) => {
              return (
                <div className={fr.cx("fr-col-6")} key={developmentPlanCategory}>
                  <Controller
                    control={control}
                    name="developmentPlanCategories"
                    rules={{ required: "Veuillez sélectionner au moins un type d'aménagement." }}
                    render={({ field }) => {
                      const isSelected = field.value.includes(developmentPlanCategory);
                      return (
                        <DevelopmentPlanCategoryTile
                          developmentPlanCategory={developmentPlanCategory}
                          disabled={options[developmentPlanCategory].disabled}
                          isSelected={isSelected}
                          onSelect={() => {
                            field.onChange(
                              isSelected
                                ? field.value.filter((v) => v !== developmentPlanCategory)
                                : [...field.value, developmentPlanCategory],
                            );
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
          <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
        </form>
      </WizardFormLayout>
    </>
  );
}

export default ProjectTypesForm;
