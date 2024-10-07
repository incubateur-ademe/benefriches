import { Controller, useForm } from "react-hook-form";
import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { DevelopmentPlanCategory, developmentPlanCategorySchema } from "shared";
import DevelopmentPlanCategoryTile from "./DevelopmentPlanCategoryTile";

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
    <section className="tw-px-6">
      <h2>Que souhaitez-vous aménager sur ce site ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="tw-grid tw-grid-cols-[repeat(auto-fill,_350px)] tw-gap-x-4">
          {options.map(({ value, disabled }) => {
            return (
              <div className="tw-mb-4" key={value}>
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

          <div className="tw-row-start-6 tw-col-start-1 tw-col-end-[-1]">
            {validationError && <p className={fr.cx("fr-error-text")}>{validationError.message}</p>}
            <Button
              className="tw-float-right"
              nativeButtonProps={{ type: "submit", disabled: !formState.isValid }}
            >
              Valider
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default ProjectTypesForm;
