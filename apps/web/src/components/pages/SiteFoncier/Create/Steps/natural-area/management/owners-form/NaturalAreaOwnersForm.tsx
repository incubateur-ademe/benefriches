import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { Input } from "@codegouvfr/react-dsfr/Input";

import { OwnerType } from "@/components/pages/SiteFoncier/naturalArea";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type FormValues = Record<OwnerType, boolean> & {
  agriculturalCompanyName?: string;
  otherCompanyName?: string;
};

function NaturalAreaOwnersForm({ onSubmit }: Props) {
  const { register, handleSubmit, watch } = useForm<FormValues>();

  const hasAgriculturalCompanyOwner =
    watch(OwnerType.AGRICULTURAL_COMPANY) === true;
  const hasOtherOwner = watch(OwnerType.OTHER) === true;

  return (
    <>
      <h2>Qui est le propriétaire de cet espace naturel ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Checkbox
          options={[
            {
              label: "Une entreprise agricole",
              nativeInputProps: register(OwnerType.AGRICULTURAL_COMPANY),
            },
          ]}
        />
        {hasAgriculturalCompanyOwner && (
          <Input
            label=""
            nativeInputProps={{
              placeholder: "Nom de l'entreprise",
              ...register("agriculturalCompanyName", {
                required: "Ce champ est requis",
              }),
            }}
          />
        )}
        <Checkbox
          options={[
            {
              label: "La collectivité",
              nativeInputProps: register(OwnerType.LOCAL_OR_REGIONAL_AUTHORITY),
            },
          ]}
        />
        <Checkbox
          options={[
            { label: "Autre/NSP", nativeInputProps: register(OwnerType.OTHER) },
          ]}
        />
        {hasOtherOwner && (
          <Input
            label=""
            nativeInputProps={{
              placeholder: "Nom de l'entreprise",
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
              children: "Suivant",
              nativeButtonProps: { type: "submit" },
            },
          ]}
        />
      </form>
    </>
  );
}

export default NaturalAreaOwnersForm;
