import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { routes } from "@/router";

function SiteFoncierCreationConfirmation() {
  return (
    <>
      <CallOut title="En construction">
        Bénéfriches est actuellement en cours de construction
      </CallOut>
      <Button
        priority="secondary"
        linkProps={routes.siteFoncierForm({ question: "type" }).link}
      >
        Retour
      </Button>
    </>
  );
}

export default SiteFoncierCreationConfirmation;
