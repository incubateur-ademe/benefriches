import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

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
    <WizardFormLayout title="😐 Le site n'est pas encore prêt à accueillir une centrale photovoltaïque.">
      <p>
        Les panneaux photovoltaïques sont censés occuper une surface de{" "}
        <strong>{formatSurfaceArea(photovoltaicPanelsSurfaceAre)}</strong>. Or, le site ne possède
        que <strong>{formatSurfaceArea(suitableSurfaceArea)}</strong> de surface compatible ; le
        reste étant occupé par des bâtiments, des arbres ou de l'eau.
      </p>
      <p>
        Vous pouvez modifier les paramètres de la centrale en retournant dans les étapes
        précédentes, ou choisir de supprimer tout ou partie des espaces en cliquant sur suivant.
      </p>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </WizardFormLayout>
  );
};

export default NonSuitableSoilsNotice;
