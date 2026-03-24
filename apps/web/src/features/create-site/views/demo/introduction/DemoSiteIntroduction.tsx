import Button from "@codegouvfr/react-dsfr/Button";

import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageText,
  EditorialPageTitle,
  EditorialPageButtonsSection,
} from "@/shared/views/layout/EditorialPageLayout";

type Props = {
  onNext: () => void;
};

function DemoSiteIntroduction({ onNext }: Props) {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>
        <span aria-hidden="true">✍️</span>
      </EditorialPageIcon>
      <EditorialPageTitle>
        Vous allez faire une évaluation demo d’impacts socio-économiques d’un projet sur un site.
      </EditorialPageTitle>
      <EditorialPageText>
        Le site et le projet seront donc fictifs, générés avec seulement 4 questions.
      </EditorialPageText>
      <EditorialPageButtonsSection>
        <Button size="large" onClick={onNext}>
          Commencer
        </Button>
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
}

export default DemoSiteIntroduction;
