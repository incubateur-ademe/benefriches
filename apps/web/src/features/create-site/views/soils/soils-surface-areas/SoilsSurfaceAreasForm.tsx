import { useForm } from "react-hook-form";
import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { SoilType } from "../../../domain/siteFoncier.types";
import { getLabelForSoilType } from "../../soilTypeLabelMapping";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  totalSurfaceArea: number;
  soils: SoilType[];
  onSubmit: (data: FormValues) => void;
};

export type FormValues = Record<SoilType, number>;

const getPercentage = (part: number, total: number) => {
  if (isNaN(part) || !total) return 0;
  return (part * 100) / total;
};

function SiteSoilsSurfaceAreasForm({
  soils,
  totalSurfaceArea,
  onSubmit,
}: Props) {
  const { register, handleSubmit, watch } = useForm<FormValues>();
  const _onSubmit = handleSubmit(onSubmit);

  return (
    <>
      <h2>Quelles sont les superficies des différents sols ?</h2>
      <p>
        La superficie du site est de {formatNumberFr(totalSurfaceArea)} m2. Les
        superficies des différents sols doivent totaliser{" "}
        {formatNumberFr(totalSurfaceArea)} m2.
      </p>
      <form onSubmit={_onSubmit}>
        {soils.map((soilType) => (
          <div key={`input-${soilType}`} className={fr.cx("fr-grid-row")}>
            <Input
              style={{ width: "50%" }}
              label={getLabelForSoilType(soilType)}
              hintText="en m2"
              nativeInputProps={{
                type: "number",
                ...register(soilType, {
                  min: 0,
                  valueAsNumber: true,
                }),
              }}
            />
            <legend
              className={fr.cx("fr-mb-4w", "fr-ml-1w")}
              style={{ alignSelf: "end" }}
            >
              {Math.round(getPercentage(watch(soilType), totalSurfaceArea))}%
            </legend>
          </div>
        ))}
        <Input
          label="Total de toutes les superficies du site"
          hintText="en m2"
          nativeInputProps={{
            value: totalSurfaceArea,
          }}
          disabled
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default SiteSoilsSurfaceAreasForm;