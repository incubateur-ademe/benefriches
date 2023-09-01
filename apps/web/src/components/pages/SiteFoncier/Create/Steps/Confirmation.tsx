import { useContext } from "react";

import { SiteFoncierPublicodesContext } from "../../PublicodesProvider";
import { useFormContext } from "react-hook-form";
import { TContext } from "../StateMachine";

function SiteFoncierCreationConfirmation() {
  const { getValues } = useFormContext();
  const { category, surfaces, address }: TContext = getValues();

  const { computeTotalSurface } = useContext(SiteFoncierPublicodesContext);

  return (
    <>
      <h2>Récapitulatif du site foncier</h2>

      <h3>
        {category &&
          `${
            category.charAt(0).toUpperCase() + category.slice(1)
          } située l’adresse : ${address}`}
      </h3>
      <p>{address}</p>

      {surfaces &&
        surfaces.map(({ category, superficie }) => (
          <p>{`${category} : ${superficie} m²`}</p>
        ))}

      <p>Total surface: {computeTotalSurface()} m²</p>
    </>
  );
}

export default SiteFoncierCreationConfirmation;
