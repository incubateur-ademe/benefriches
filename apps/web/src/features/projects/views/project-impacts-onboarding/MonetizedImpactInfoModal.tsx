import Button from "@codegouvfr/react-dsfr/Button";
import { useId } from "react";

import DsfrA11yDialog from "@/shared/views/components/Dialog/DsfrA11yDialog";

import { SectionContent } from "../shared/impacts/AboutImpactsContent";
import { MONETIZED_IMPACT_SECTION } from "../shared/impacts/aboutBenefrichesContent";

const MONETIZED_IMPACT_INFO_DIALOG_ID = "monetized-impact-info-modal";

function MonetizedImpactInfoModal() {
  const id = useId();
  const dialogId = `${MONETIZED_IMPACT_INFO_DIALOG_ID}-${id}`;

  return (
    <>
      <Button
        priority="tertiary no outline"
        className="mt-1 -ml-8"
        aria-controls={dialogId}
        data-fr-opened={false}
        size="small"
      >
        En savoir plus sur les impacts monétaires et leur mode de calcul
      </Button>
      <DsfrA11yDialog dialogId={dialogId} title={MONETIZED_IMPACT_SECTION.title} size="medium">
        <SectionContent section={MONETIZED_IMPACT_SECTION} />
      </DsfrA11yDialog>
    </>
  );
}

export default MonetizedImpactInfoModal;
