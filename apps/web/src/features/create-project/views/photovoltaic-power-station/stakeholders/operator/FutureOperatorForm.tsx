import Input from "@codegouvfr/react-dsfr/Input";
import { useForm } from "react-hook-form";

import { UserStructureType } from "@/features/onboarding/core/user";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  userStructureName: string;
  userStructureType: UserStructureType;
};

export type FormValues =
  | {
      structureOption: "other_structure";
      otherStructureName: string;
    }
  | {
      structureOption: "user_structure";
      otherStructureName: undefined;
    };

function FutureOperatorForm({
  initialValues,
  userStructureType,
  userStructureName,
  onSubmit,
  onBack,
}: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    defaultValues: initialValues,
    shouldUnregister: true,
  });

  const structureOption = watch("structureOption");

  return (
    <WizardFormLayout title="Qui sera l'exploitant de la centrale photovoltaïque&nbsp;?">
      <form onSubmit={handleSubmit(onSubmit)}>
        {userStructureType === "local_authority" ? (
          <Input
            label={<RequiredLabel label="Nom de la structure" />}
            state={formState.errors.otherStructureName ? "error" : "default"}
            stateRelatedMessage={formState.errors.otherStructureName?.message}
            nativeInputProps={register("otherStructureName", {
              required: "Ce champ est requis",
            })}
          />
        ) : (
          <Fieldset
            state={formState.errors.structureOption ? "error" : "default"}
            stateRelatedMessage={
              formState.errors.structureOption
                ? formState.errors.structureOption.message
                : undefined
            }
          >
            <RadioButton
              label={`Ma structure, ${userStructureName}`}
              value="user_structure"
              {...register("structureOption", { required: true })}
            />
            <RadioButton
              label="Une autre structure"
              value="other_structure"
              {...register("structureOption", { required: true })}
            />
            {structureOption === "other_structure" && (
              <Input
                className="tw-ml-8"
                label={<RequiredLabel label="Nom de la structure" />}
                state={formState.errors.otherStructureName ? "error" : "default"}
                stateRelatedMessage={formState.errors.otherStructureName?.message}
                nativeInputProps={register("otherStructureName", {
                  required: "Ce champ est requis",
                })}
              />
            )}
          </Fieldset>
        )}
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default FutureOperatorForm;
