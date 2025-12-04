import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
  EditorialPageButtonsSection,
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
        Continuons sur les bâtiments et voyons maintenant quels seront leurs usages.
      </EditorialPageTitle>
      <EditorialPageText>
        Les lieux d'habitation et d'activité peuvent comporter des habitations, des lieux d'activité
        économique, des établissements éducatifs, des espaces de santé, des établissements
        médico-sociaux, mais aussi des lieux socio-culturels, des équipements sportifs, des
        bâtiments publics ou encore des parkings silo.
      </EditorialPageText>
      <EditorialPageText>Voyons lesquels vous envisagez d'aménager.</EditorialPageText>
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
};

export default BuildingsUseIntroduction;
