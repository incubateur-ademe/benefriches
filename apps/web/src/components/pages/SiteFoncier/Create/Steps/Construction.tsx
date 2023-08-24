import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { routes } from "@/router";

function SiteFoncierCreationConstruction() {
  return (
    <>
      <CallOut title="En construction">
        La suite de ce parcours est actuellement en cours de construction
      </CallOut>
      <Button
        priority="secondary"
        linkProps={routes.createSiteFoncier({ question: "type" }).link}
      >
        Retour
      </Button>
    </>
  );
}

export default SiteFoncierCreationConstruction;
