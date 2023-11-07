import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  onSubmit: (data: FormValues) => void;
  maxRecommendedPower: number;
  siteSurfaceArea: number;
};

type FormValues = {
  photovoltaicPower: number;
};

function PhotovoltaicPowerForm({
  onSubmit,
  siteSurfaceArea,
  maxRecommendedPower,
}: Props) {
  const { control, handleSubmit } = useForm<FormValues>();

  const hintText = `en kWh (maximum conseillé : ${formatNumberFr(
    maxRecommendedPower,
    0,
  )} kWh)`;

  return (
    <>
      <h2>Quel sera la puissance de votre installation ?</h2>
      <p>
        Le ratio superficie / puissance d’installation est de{" "}
        <strong>14000&#8239;m² pour 1000 kWc.</strong>
      </p>
      <p>
        La superficie du site étant de {formatNumberFr(siteSurfaceArea, 0)}
        &#8239;m², votre puissance devrait être de maximum{" "}
        {formatNumberFr(maxRecommendedPower, 0)}&#8239;kWh.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="photovoltaicPower"
          label="Puissance de l’installation"
          hintText={hintText}
          rules={{
            min: 0,
            max: {
              value: maxRecommendedPower,
              message:
                "La superficie induite par la puissance d’installation est supérieure à la superficie de la friche. Nous vous conseillons de réduire la puissance d’installation.",
            },
            required:
              "Ce champ est nécessaire pour déterminer les questions suivantes",
          }}
          control={control}
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default PhotovoltaicPowerForm;
