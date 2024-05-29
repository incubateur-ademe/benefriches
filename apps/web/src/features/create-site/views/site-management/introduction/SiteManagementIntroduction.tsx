import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
} from "@/shared/views/layout/EditorialPageLayout";

type Props = {
  isFriche: boolean;
  onNext: () => void;
  onBack: () => void;
};

const SiteManagementIntroduction = ({ isFriche, onNext, onBack }: Props) => {
  const title = isFriche
    ? "Un ou plusieurs acteurs sont liés à la friche"
    : "Un ou plusieurs acteurs sont liés au site";
  const text = isFriche
    ? "Nous avons besoin de les connaître pour savoir à qui seront imputables les différents coûts liés à la friche."
    : "Nous avons besoin de les connaître pour savoir qui prend à sa charge les coûts et touche les éventuelles recettes d'exploitation.";
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>🧑‍💼</EditorialPageIcon>
      <EditorialPageTitle>{title}</EditorialPageTitle>
      <EditorialPageText>{text} </EditorialPageText>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </EditorialPageLayout>
  );
};

export default SiteManagementIntroduction;
