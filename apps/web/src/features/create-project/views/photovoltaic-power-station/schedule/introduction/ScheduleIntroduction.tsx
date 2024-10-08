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

const ScheduleIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>📆</EditorialPageIcon>
      <EditorialPageTitle> Pour quand ce projet est-il prévu ?</EditorialPageTitle>
      <EditorialPageText>
        Pour pouvoir calculer les impacts du projet sur une certaine durée, nous avons besoin de
        connaître les différentes échéances.
      </EditorialPageText>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </EditorialPageLayout>
  );
};

export default ScheduleIntroduction;
