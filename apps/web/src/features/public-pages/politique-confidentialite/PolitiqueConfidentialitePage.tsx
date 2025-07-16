import { fr } from "@codegouvfr/react-dsfr";

import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import PolitiqueConfidentialiteContent from "@/shared/views/components/PolitiqueConfidentialiteContent/PolitiqueConfidentialiteContent";

function PolitiqueConfidentialitePage() {
  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <HtmlTitle>Politique de confidentialité</HtmlTitle>
      <h1>Politique de confidentialité</h1>
      <PolitiqueConfidentialiteContent />
    </section>
  );
}

export default PolitiqueConfidentialitePage;
