import Tooltip from "@codegouvfr/react-dsfr/Tooltip";
import { convertCarbonToCO2eq } from "shared";

import { getCarbonTonsInAverageFrenchAnnualEmissionsPerPerson } from "@/shared/core/carbonEmissions";
import {
  formatCarbonStorage,
  formatPerFrenchPersonAnnualEquivalent,
} from "@/shared/core/format-number/formatCarbonStorage";

type Props = {
  carbonStorageDifference: number;
};

const AnnualFrenchEmissionPerPersonEquivalent = ({ carbonStorage }: { carbonStorage: number }) => {
  const carbonStorageDifferenceInAnnualFrenchEmissionPerPerson = Math.abs(
    getCarbonTonsInAverageFrenchAnnualEmissionsPerPerson(carbonStorage),
  );
  const formattedValue = formatPerFrenchPersonAnnualEquivalent(
    carbonStorageDifferenceInAnnualFrenchEmissionPerPerson,
  );
  return (
    <p>
      Cela correspond à{" "}
      <strong>{formatCarbonStorage(convertCarbonToCO2eq(carbonStorage))} t de CO2-eq</strong>{" "}
      <Tooltip
        kind="hover"
        title={
          <>
            La quantité de carbone stockée dans les sols du site (exprimé en kg éq. C) est la somme,
            pour chacun des sols rencontrés sur le site, du produit du stock de référence associé à
            un type de sols (exprimé en kg éq. C/hectare) par la surface occupée par ce type de sol
            (exprimée en hectare).
            <br />
            Le changement d'unité kg éq. C en kg éq. CO₂ est opéré en multipliant la somme obtenue
            par le ratio 3,67.
            <br />1 kg Carbone = 3,67 kg de CO₂.
          </>
        }
      />
      <br />
      C'est l'équivalent de ce qu'émettent <strong>{formattedValue} français</strong> en{" "}
      <strong>1 an</strong>.
    </p>
  );
};

const CarbonStorageDifferenceSection = ({ carbonStorageDifference }: Props) => {
  if (carbonStorageDifference > 0) {
    return (
      <div>
        <p>
          🤩 Bonne nouvelle, ce site pourrait stocker{" "}
          <strong>{formatCarbonStorage(carbonStorageDifference)} t de carbone</strong> en plus ! 🍂
        </p>
        <AnnualFrenchEmissionPerPersonEquivalent carbonStorage={carbonStorageDifference} />
      </div>
    );
  }

  if (carbonStorageDifference < 0) {
    return (
      <div>
        <p>
          😭 Malheureusement, ce site pourrait stocker{" "}
          <strong>
            {formatCarbonStorage(Math.abs(carbonStorageDifference))} t de carbone en moins. ☁️
          </strong>
        </p>
        <AnnualFrenchEmissionPerPersonEquivalent
          carbonStorage={Math.abs(carbonStorageDifference)}
        />
      </div>
    );
  }

  return (
    <div>
      <p>Aucun changement notable.</p>
      <p>La capacité de stockage du carbone par les sols ne sera pas affectée par le projet.</p>
    </div>
  );
};

export default CarbonStorageDifferenceSection;
