import type { SoilType } from "shared";

import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/core/label-mapping/soilTypeLabelMapping";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import {
  EditorialPageButtonsSection,
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageTitle,
} from "@/shared/views/layout/EditorialPageLayout";

type Props = {
  existingNaturalSoils: { soilType: SoilType; surfaceArea: number }[];
  onNext: () => void;
  onBack: () => void;
};

const PublicGreenSpacesIntroduction = ({ existingNaturalSoils, onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>🌳</EditorialPageIcon>
      <EditorialPageTitle>
        Bonne nouvelle ! Le site comporte des espaces de nature que vous pouvez inclure dans vos
        espaces verts&nbsp;:
      </EditorialPageTitle>
      <ul className="text-lg">
        {existingNaturalSoils.map(({ soilType, surfaceArea }) => (
          <li key={soilType}>
            <strong>{getLabelForSoilType(soilType)}</strong> : {formatSurfaceArea(surfaceArea)}
          </li>
        ))}
      </ul>
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
};

export default PublicGreenSpacesIntroduction;
