import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import {
  EditorialPageButtonsSection,
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
} from "@/shared/views/layout/EditorialPageLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

function MissingInformationIntroduction({ onNext, onBack }: Props) {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>
        <img src="/img/pictograms/missing-information.svg" alt="" width={120} height={120} />
      </EditorialPageIcon>
      <EditorialPageTitle>Il vous manque des infos&nbsp;? Pas de panique&nbsp;!</EditorialPageTitle>
      <div className="flex flex-col gap-4">
        <EditorialPageText>
          Vous pouvez laisser des champs vides ou saisir des estimations, et les modifier plus tard.
        </EditorialPageText>
        <EditorialPageText>
          Certaines valeurs sont pré-remplies quand c'est possible.
        </EditorialPageText>
      </div>
      <EditorialPageButtonsSection>
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
}

export default MissingInformationIntroduction;
