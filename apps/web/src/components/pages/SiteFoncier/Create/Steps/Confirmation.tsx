import { useContext } from "react";

import { SiteFoncierPublicodesContext } from "../../PublicodesProvider";
import { useFormContext } from "react-hook-form";
import { TContext } from "../StateMachine";
import { getSurfaceCategoryLabel } from "@/helpers/getLabelForValue";

function SiteFoncierCreationConfirmation() {
  const { getValues } = useFormContext();
  const { category, surfaces, address, name, description }: TContext =
    getValues();

  const { computeTotalSurface } = useContext(SiteFoncierPublicodesContext);

  return (
    <>
      <h2>Récapitulatif du site foncier</h2>

      <h3>{name}</h3>

      <p>Type : {category}</p>
      <p>{address}</p>

      <p>{description}</p>

      {surfaces &&
        surfaces.map(({ category, superficie }) => (
          <p>{`${getSurfaceCategoryLabel(category)} : ${superficie} m²`}</p>
        ))}

      <p>Total surface: {computeTotalSurface()} m²</p>
    </>
  );
}

export default SiteFoncierCreationConfirmation;
