import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import Input from "@codegouvfr/react-dsfr/Input";

type Props = {
  defaultCompanyName?: string;
  onSubmit: (runningCompanyName: string) => void;
  onBack: () => void;
};

type FormValues = {
  defaultCompanyName?: string;
  otherCompanyName?: string;
  initialChoice?: boolean;
  otherCompany: boolean;
};

const mapFormValues = (formValues: FormValues): string => {
  if (formValues.initialChoice) {
    return formValues.defaultCompanyName as string;
  }
  return formValues.otherCompanyName ?? "";
};

function NaturalAreaRunningCompanyForm({
  onSubmit,
  onBack,
  defaultCompanyName,
}: Props) {
  const { register, handleSubmit, watch } = useForm<FormValues>({
    values: { defaultCompanyName, otherCompany: false },
  });

  const _onSubmit = (data: FormValues) => onSubmit(mapFormValues(data));

  return (
    <>
      <h2>Qui est l'exploitant de cet espace naturel ?</h2>
      <form onSubmit={handleSubmit(_onSubmit)}>
        {defaultCompanyName && (
          <Checkbox
            options={[
              {
                label: defaultCompanyName,
                nativeInputProps: register("initialChoice"),
              },
            ]}
          />
        )}
        <Checkbox
          options={[
            {
              label: "Autre",
              nativeInputProps: register("otherCompany"),
            },
          ]}
        />
        {watch("otherCompany") && (
          <Input
            label=""
            nativeInputProps={{
              placeholder: "Nom de l'exploitant",
              ...register("otherCompanyName", {
                required: "Ce champ est requis",
              }),
            }}
          />
        )}
        <ButtonsGroup
          buttonsEquisized
          inlineLayoutWhen="always"
          buttons={[
            {
              children: "Retour",
              onClick: onBack,
              priority: "secondary",
              nativeButtonProps: { type: "button" },
            },
            {
              children: "Suivant",
              nativeButtonProps: { type: "submit" },
            },
          ]}
        />
      </form>
    </>
  );
}

export default NaturalAreaRunningCompanyForm;
