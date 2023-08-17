import { useContext } from "react";

import { routes } from "@/router";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { AddressType, FormDataContext } from "../StateProvider";
import { useForm } from "react-hook-form";

type FormValues = {
  address: AddressType;
};

function SiteFoncierCreationQuestionAddress() {
  const { setAddress, address, kind } = useContext(FormDataContext);

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      address,
    },
  });

  const onSubmit = handleSubmit(({ address }) => {
    setAddress(address);
    const question = kind !== "friche" ? "construction" : "espaces.types";
    routes.siteFoncierForm({ question }).push();
  });

  return (
    <form onSubmit={onSubmit}>
      <h2>Où est située cette friche ?</h2>

      <Input
        label="Adresse du site"
        state="default"
        nativeInputProps={register("address")}
      />

      <ButtonsGroup
        buttonsEquisized
        inlineLayoutWhen="always"
        buttons={[
          {
            children: "Retour",
            linkProps: routes.siteFoncierForm({ question: "type" }).link,
            priority: "secondary",
          },
          {
            children: "Suivant",
            nativeButtonProps: { type: "submit" },
          },
        ]}
      />
    </form>
  );
}

export default SiteFoncierCreationQuestionAddress;
