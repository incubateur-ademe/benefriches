import { Button } from "@codegouvfr/react-dsfr/Button";
import { DocumentType } from "../../domain/project.types";

type Props = {
  onNext: () => void;
  siteName: string;
  documents: DocumentType[];
};

const getLabelForDocumentType = (documentType: DocumentType): string => {
  switch (documentType) {
    case "BUILDING_PERMIT":
      return "Permis de construire";
    case "FORECAST_BALANCE_SHEET":
      return "Bilan Prévisionnel";
  }
};

function ProjectDocumentsPage({ siteName, documents, onNext }: Props) {
  return (
    <>
      <h2>Documents utiles</h2>

      <p>
        Pour vous aider à saisir les informations liées au projet sur le site «{" "}
        {siteName} », nous vous conseillons de vous munir des documents suivants
        :
      </p>

      <ul>
        {documents.map((documentType) => (
          <li key={documentType}>{getLabelForDocumentType(documentType)}</li>
        ))}
      </ul>

      <p>
        Vous pourrez remplir le formulaire si vous n’avez pas ces documents car
        la plupart des questions ne sont pas obligatoires. Néanmoins, plus les
        informations seront complètes, plus les résultats seront fiables !
      </p>
      <Button nativeButtonProps={{ type: "button", onClick: onNext }}>
        Saisir les informations
      </Button>
    </>
  );
}

export default ProjectDocumentsPage;
