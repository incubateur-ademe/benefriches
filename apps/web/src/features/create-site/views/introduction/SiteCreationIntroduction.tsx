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

function CreateSiteIntroductionPage({ onNext }: Props) {
  return (
    <EditorialPageLayout>
      <EditorialPageIcon>
        {/* we use a negative margin-left to compensate the emoji's left padding */}
        <span className="ml-[-18px]">📍</span>
      </EditorialPageIcon>
      <EditorialPageTitle>Tout commence sur un site.</EditorialPageTitle>
      <EditorialPageText>
        Nous allons d'abord parler du <strong>site existant</strong> : la nature du site,
        l'occupation des sols, les dépenses associées, etc.
        <br />
        Une fois que ce site sera décrit, vous pourrez alors créer un ou plusieurs{" "}
        <strong>projets d'aménagement</strong> sur ce site.
      </EditorialPageText>
      <EditorialPageButtonsSection>
        <Button size="large" onClick={onNext}>
          Commencer
        </Button>
      </EditorialPageButtonsSection>
    </EditorialPageLayout>
  );
}

export default CreateSiteIntroductionPage;
