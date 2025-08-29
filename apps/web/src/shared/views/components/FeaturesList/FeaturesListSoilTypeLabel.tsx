import { CSSProperties } from "react";
import { SoilType } from "shared";

import { getLabelForSoilType } from "@/shared/core/label-mapping/soilTypeLabelMapping";
import { getColorForSoilType } from "@/shared/core/soils";

import classNames from "../../clsx";

const SoilTypeLabelWithColorSquare = ({ soilType }: { soilType: SoilType }) => {
  return (
    <>
      <span
        className={classNames(
          "mr-2",
          "inline-flex",
          `bg-[var(--soil-legend-bg-color)]`,
          "h-4",
          "w-4",
          "rounded",
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
