import { CSSProperties } from "react";
import { SoilType } from "shared";

import { getColorForSoilType } from "@/shared/domain/soils";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";

import classNames from "../../clsx";

const SoilTypeLabelWithColorSquare = ({ soilType }: { soilType: SoilType }) => {
  return (
    <>
      <span
        className={classNames(
          "tw-mr-2",
          "tw-inline-flex",
          `tw-bg-[var(--soil-legend-bg-color)]`,
          "tw-h-4",
          "tw-w-4",
          "tw-rounded",
        )}
        aria-hidden="true"
        style={
          {
            "--soil-legend-bg-color": getColorForSoilType(soilType),
          } as CSSProperties
        }
      ></span>
      {getLabelForSoilType(soilType)}
    </>
  );
};

export default SoilTypeLabelWithColorSquare;
