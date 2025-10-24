import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
} from "@/shared/views/layout/EditorialPageLayout";

type Props = {
  greenSpacesSurfaceArea: number;
  onNext: () => void;
  onBack: () => void;
};

const UrbanGreenSpacesIntroduction = ({ greenSpacesSurfaceArea, onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>🌳</EditorialPageIcon>
      <EditorialPageTitle>Parlons des espaces verts publics.</EditorialPageTitle>
      <EditorialPageText>
        Vous envisagez d’aménager <strong>{formatSurfaceArea(greenSpacesSurfaceArea)}</strong>{" "}
        d’espaces verts publics.
      </EditorialPageText>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </EditorialPageLayout>
  );
};

export default UrbanGreenSpacesIntroduction;
