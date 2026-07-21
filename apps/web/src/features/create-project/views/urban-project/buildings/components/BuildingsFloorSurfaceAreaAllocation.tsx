import {
  sumObjectValues,
  type BuildingsUseDistribution,
  type UrbanProjectUseWithBuilding,
} from "shared";

import { getLabelForUrbanProjectUse } from "@/features/create-project/core/urban-project/urbanProject";
import { getColorForBuildingsUse } from "@/shared/core/urbanProject";

const RECTANGLE_HEIGHT_PX = 320;
const LABEL_MIN_HEIGHT_PX = 24;

type Props = {
  allocations: BuildingsUseDistribution;
  selectedUses: UrbanProjectUseWithBuilding[];
  caption: string;
};

function BuildingsFloorSurfaceAreaAllocation({ allocations, selectedUses, caption }: Props) {
  const totalAllocated = sumObjectValues(allocations);

  return (
    <div className="flex flex-col items-center gap-2 mt-8">
      <div
        className="w-50 overflow-hidden rounded-md border border-gray-300"
        style={{ height: RECTANGLE_HEIGHT_PX }}
      >
        {totalAllocated > 0 &&
          selectedUses.map((use) => {
            const value = allocations[use] ?? 0;
            if (value === 0) return null;

            const heightPercent = (value / totalAllocated) * 100;
            const heightPx = (heightPercent / 100) * RECTANGLE_HEIGHT_PX;
            const showLabel = heightPx >= LABEL_MIN_HEIGHT_PX;

            return (
              <div
                key={use}
                data-testid={`allocation-segment-${use}`}
                className="flex items-center justify-center px-2 text-center text-sm text-white"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: getColorForBuildingsUse(use),
                }}
              >
                {showLabel && getLabelForUrbanProjectUse(use)}
              </div>
            );
          })}
      </div>
      <p className="m-0 text-sm text-gray-700">{caption}</p>
    </div>
  );
}

export default BuildingsFloorSurfaceAreaAllocation;
