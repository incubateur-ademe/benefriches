import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import {
  EditorialPageButtonsSection,
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
} from "@/shared/views/layout/EditorialPageLayout";

type Props = {
  buildingsFootprintToDemolish: number;
  onNext: () => void;
  onBack: () => void;
};

const BuildingsDemolitionInfo = ({ buildingsFootprintToDemolish, onBack, onNext }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>💥</EditorialPageIcon>
      <EditorialPageTitle>
        {formatSurfaceArea(buildingsFootprintToDemolish)} de bâtiments seront démolis.
      </EditorialPageTitle>
      <EditorialPageText>
        Il s'agit de la surface des bâtiments existants que vous ne prévoyez pas d'utiliser dans
        votre projet.
      </EditorialPageText>
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
};

export default BuildingsDemolitionInfo;
