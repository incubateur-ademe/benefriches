import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
} from "@/shared/views/layout/EditorialPageLayout";

type Props = {
  publicSpacesSurfaceArea: number;
  onNext: () => void;
  onBack: () => void;
};

const PublicSpacesIntroduction = ({ publicSpacesSurfaceArea, onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>🏢</EditorialPageIcon>
      <EditorialPageTitle>Parlons maintenant des espaces publics.</EditorialPageTitle>
      <EditorialPageText>
        Vous envisagez d'aménager <strong>{formatSurfaceArea(publicSpacesSurfaceArea)}</strong>{" "}
        d'espaces publics.
      </EditorialPageText>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </EditorialPageLayout>
  );
};

export default PublicSpacesIntroduction;
