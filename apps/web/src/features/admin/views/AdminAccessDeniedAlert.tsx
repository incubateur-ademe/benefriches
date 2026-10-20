import Alert from "@codegouvfr/react-dsfr/Alert";

export default function AdminAccessDeniedAlert() {
  return (
    <Alert
      severity="warning"
      title="Accès réservé aux administrateurs"
      description="Vous n'avez pas les droits nécessaires pour accéder à cette page."
    />
  );
}
