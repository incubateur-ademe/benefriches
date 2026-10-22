// oxlint-disable-next-line architecture-boundaries/no-cross-layer-import
import AboutImpactsContent from "@/features/projects/views/shared/impacts/AboutImpactsContent";

import DsfrA11yDialog from "../../components/Dialog/DsfrA11yDialog";
import { ABOUT_IMPACTS_DIALOG_ID, FAQ_HEADER_ITEM } from "./headerItems";

function AboutImpactsHeaderDialog() {
  return (
    <DsfrA11yDialog dialogId={ABOUT_IMPACTS_DIALOG_ID} title={FAQ_HEADER_ITEM.text} size="large">
      <AboutImpactsContent />
    </DsfrA11yDialog>
  );
}

export default AboutImpactsHeaderDialog;
