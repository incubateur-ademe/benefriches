import { routes } from "@/router";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { useCallback, useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormDataContext } from "../StateProvider";
import { SURFACE_KINDS, SurfacesDistributionType } from "../../constants";
import { SiteFoncierPublicodesContext } from "../../PublicodesProvider";

type FormValues = SurfacesDistributionType;

function SiteFoncierCreationQuestionSurfacesDistribution() {
  const [totalArea, setTotalArea] = useState(0);

  const { surfaceKinds, setSurfacesDistribution, surfacesDistribution } =
    useContext(FormDataContext);
  const { computeTotalSurface, setSurfaceSituation } = useContext(
    SiteFoncierPublicodesContext,
  );

  const { register, handleSubmit, getValues } = useForm<FormValues>({
    defaultValues: surfacesDistribution,
  });

  const onBlur = useCallback(() => {
    setSurfaceSituation(getValues());
    setTotalArea(computeTotalSurface());
  }, [computeTotalSurface, getValues, setSurfaceSituation]);
  setSurfaceSituation;
  const onSubmit: SubmitHandler<FormValues> = useCallback(
    (data) => {
      setSurfacesDistribution(data);
      routes.siteFoncierForm({ question: "confirmation" }).push();
    },
    [setSurfacesDistribution],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Quelles sont les superficies des différents espaces ?</h2>

      {surfaceKinds.map((key) => (
        <Input
          label={SURFACE_KINDS[key].label}
          hintText="Superficie en m²"
          state="default"
          key={key}
          nativeInputProps={{
            ...register(key, { required: "Ce champ est requis" }),
            onBlur,
            inputMode: "numeric",
            pattern: "[0-9]*",
            type: "number",
            placeholder: "5000",
          }}
        />
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

export default SiteFoncierCreationQuestionSurfacesDistribution;
