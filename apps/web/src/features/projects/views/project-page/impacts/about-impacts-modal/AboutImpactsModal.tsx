import { aboutImpactsModal } from ".";
import AboutImpactsContcnt from "../../../shared/impacts/AboutImpactsContent";

function AboutImpactsModal() {
  return (
    <aboutImpactsModal.Component title="Comprendre les impacts" size="large">
      <h2 className="tw-text-xl">Questions fréquentes</h2>
      <AboutImpactsContcnt />
    </aboutImpactsModal.Component>
  );
}

export default AboutImpactsModal;
