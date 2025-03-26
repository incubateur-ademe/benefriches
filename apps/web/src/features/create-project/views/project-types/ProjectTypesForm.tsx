import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { Controller, useForm } from "react-hook-form";
import { DevelopmentPlanCategory, developmentPlanCategorySchema } from "shared";

import TileFormFieldWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFieldWrapper";
import TileFormFieldsWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFieldsWrapper";
import TileFormFooterWrapper from "@/shared/views/layout/TileFormWrapper/TileFormFooterWrapper";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import DevelopmentPlanCategoryTile from "./DevelopmentPlanCategoryTile";

type Props = {
  onSubmit: (data: FormValues) => void;
  initialValues: FormValues | undefined;
  allowedDevelopmentPlanCategories: DevelopmentPlanCategory[];
};

type FormValues = {
  developmentPlanCategory: DevelopmentPlanCategory;
};

function ProjectTypesForm({ onSubmit, initialValues, allowedDevelopmentPlanCategories }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const validationError = formState.errors.developmentPlanCategory;

  const options = developmentPlanCategorySchema.options.map((option) => {
    return {
      value: option,
      disabled: !allowedDevelopmentPlanCategories.includes(option),
    };
  });

  return (
    <WizardFormLayout title="Que souhaitez-vous aménager sur ce site ?" fullScreen>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TileFormFieldsWrapper small>
          {options.map(({ value, disabled }) => {
            return (
              <TileFormFieldWrapper key={value}>
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
              </TileFormFieldWrapper>
            );
          })}

          <TileFormFooterWrapper tileCount={options.length}>
            {validationError && <p className={fr.cx("fr-error-text")}>{validationError.message}</p>}
            <Button
              className="tw-float-right"
              nativeButtonProps={{ type: "submit", disabled: !formState.isValid }}
            >
              Valider
            </Button>
          </TileFormFooterWrapper>
        </TileFormFieldsWrapper>
      </form>
    </WizardFormLayout>
  );
}

export default ProjectTypesForm;
