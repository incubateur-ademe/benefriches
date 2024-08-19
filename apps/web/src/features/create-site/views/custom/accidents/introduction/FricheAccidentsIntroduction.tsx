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

const FricheAccidentsIntroduction = ({ onNext, onBack }: Props) => {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>💥</EditorialPageIcon>
      <EditorialPageTitle>Des accidents peuvent survenir sur la friche</EditorialPageTitle>
      <EditorialPageText>
        Cela peut malheureusement arriver lorsqu'un site est laissé à l'abandon.
      </EditorialPageText>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </EditorialPageLayout>
  );
};

export default FricheAccidentsIntroduction;
