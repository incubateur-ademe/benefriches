import { aboutImpactsModal } from ".";
import AboutImpactsContent from "../../../shared/impacts/AboutImpactsContent";

function AboutImpactsModal() {
  return (
    <aboutImpactsModal.Component title="Comprendre les impacts" size="large">
      <h2 className="text-xl">Questions fréquentes</h2>
      <AboutImpactsContent />
    </aboutImpactsModal.Component>
  );
}

export default AboutImpactsModal;
