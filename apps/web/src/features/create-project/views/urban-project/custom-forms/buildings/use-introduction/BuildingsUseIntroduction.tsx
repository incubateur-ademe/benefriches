import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
} from "@/shared/views/layout/EditorialPageLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const BuildingsUseIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>🏫</EditorialPageIcon>
      <EditorialPageTitle>
        Nous allons maintenant parler des bâtiments qui composeront les lieux de vie et d'activité.
      </EditorialPageTitle>
      <EditorialPageText>
        Les lieux de vie et d'activité peuvent comporter des habitations, des lieux d'activité
        économique, des établissements éducatifs, des espaces de santé, des établissements
        médico-sociaux, mais aussi des lieux socio-culturels, des équipements sportifs, des
        bâtiments publics ou encore des parkings silo.
      </EditorialPageText>
      <EditorialPageText>Voyons lesquels vous envisagez d'aménager.</EditorialPageText>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </EditorialPageLayout>
  );
};

export default BuildingsUseIntroduction;
