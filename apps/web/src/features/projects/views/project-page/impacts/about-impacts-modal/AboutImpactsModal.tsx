import Dialog from "@/shared/views/components/Dialog/A11yDialog";

import AboutImpactsContent from "../../../shared/impacts/AboutImpactsContent";

export const ABOUT_IMPACTS_DIALOG_ID = "about-benefriches-impacts-modal";

function AboutImpactsModal() {
  return (
    <Dialog dialogId={ABOUT_IMPACTS_DIALOG_ID} title="Comprendre les impacts" size="medium">
      <h2 className="text-xl">Questions fréquentes</h2>
      <AboutImpactsContent />
    </Dialog>
  );
}

export default AboutImpactsModal;
