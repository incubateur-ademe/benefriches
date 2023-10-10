import { useForm } from "react-hook-form";
import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { getLabelForFricheSoilType } from "../soilTypeLabelMapping";

import { FricheSoilType } from "@/features/create-site/domain/friche.types";

type Props = {
  totalSurfaceArea: number;
  soils: FricheSoilType[];
  onSubmit: (data: FormValues) => void;
};

export type FormValues = Record<FricheSoilType, number>;

const getPercentage = (part: number, total: number) => {
  if (isNaN(part) || !total) return 0;
  return (part * 100) / total;
};

function FricheSoilsSurfaceAreasForm({
  soils,
  totalSurfaceArea,
  onSubmit,
}: Props) {
  const { register, handleSubmit, watch } = useForm<FormValues>();
  const _onSubmit = handleSubmit(onSubmit);

  return (
    <>
      <h2>Quelles sont les superficies des différents sols ?</h2>
      <form onSubmit={_onSubmit}>
        {soils.map((soilType) => (
          <div key={`input-${soilType}`} className={fr.cx("fr-grid-row")}>
            <Input
              style={{ width: "50%" }}
              label={getLabelForFricheSoilType(soilType)}
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
          label="Total de toutes les superficies de la friche"
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

export default FricheSoilsSurfaceAreasForm;
