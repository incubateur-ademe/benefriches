import { routes } from "@/router";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { useCallback, useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormDataContext } from "../StateProvider";
import { SPACES_KINDS, SpaceKindsType } from "../../constants";
import { SiteFoncierPublicodesContext } from "../../PublicodesProvider";

type FormValues = Record<SpaceKindsType, string>;

function SiteFoncierCreationQuestionSpacesSize() {
  const [totalArea, setTotalArea] = useState(0);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>();

  const { spacesKinds } = useContext(FormDataContext);
  const { computeTotalSurface, setSpacesSituation } = useContext(
    SiteFoncierPublicodesContext,
  );

  console.log(errors);

  const onBlur = useCallback(() => {
    setSpacesSituation(getValues());
    setTotalArea(computeTotalSurface());
  }, [computeTotalSurface, getValues, setSpacesSituation]);

  const onSubmit: SubmitHandler<FormValues> = useCallback((data) => {
    console.log(data);
    routes.siteFoncierForm({ question: "confirmation" }).push();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Quelles sont les superficies des différents espaces ?</h2>

      {spacesKinds.map((key) => (
        <>
          <Input
            label={SPACES_KINDS[key].label}
            hintText="Superficie en m²"
            state="default"
            nativeInputProps={{
              ...register(key, { required: "Ce champ est requis" }),
              onBlur,
              key,
              inputMode: "numeric",
              pattern: "[0-9]*",
              type: "number",
              placeholder: "5000",
            }}
          />
        </>
      ))}

      <Input
        label="Surface totale de la friche"
        hintText="Superficie en m²"
        disabled
        nativeInputProps={{
          value: totalArea,
        }}
      />

      <ButtonsGroup
        buttonsEquisized
        inlineLayoutWhen="always"
        buttons={[
          {
            children: "Retour",
            linkProps: routes.siteFoncierForm({ question: "espaces.types" })
              .link,
            priority: "secondary",
          },
          {
            children: "Suivant",
            nativeButtonProps: {
              type: "submit",
            },
          },
        ]}
      />
    </form>
  );
}

export default SiteFoncierCreationQuestionSpacesSize;
