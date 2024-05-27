import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
} from "@/shared/views/layout/EditorialPageLayout";

type Props = {
  photovoltaicPanelsSurfaceAre: number;
  suitableSurfaceArea: number;
  onNext: () => void;
  onBack: () => void;
};

const NonSuitableSoilsNotice = ({
  photovoltaicPanelsSurfaceAre,
  suitableSurfaceArea,
  onNext,
  onBack,
}: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>😐</EditorialPageIcon>
      <EditorialPageTitle>
        Le site n'est pas encore prêt à accueillir une centrale photovoltaïque.
      </EditorialPageTitle>
      <EditorialPageText>
        Les panneaux photovoltaïques sont censés occuper une surface de{" "}
        <strong>{formatSurfaceArea(photovoltaicPanelsSurfaceAre)}</strong>. Or, le site ne possède
        que <strong>{formatSurfaceArea(suitableSurfaceArea)}</strong> de surface compatible ; le
        reste étant occupé par des bâtiments, des arbres ou de l'eau.
        <br />
        Vous pouvez modifier les paramètres de la centrale en retournant dans les étapes
        précédentes, ou choisir de supprimer tout ou partie des espaces en cliquant sur suivant.
      </EditorialPageText>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </EditorialPageLayout>
  );
};

export default NonSuitableSoilsNotice;
