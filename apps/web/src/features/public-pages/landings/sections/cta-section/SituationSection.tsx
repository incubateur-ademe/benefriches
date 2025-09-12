import SectionTitle from "../SectionTitle";
import BenefrichesButton from "./BenefrichesButton";
import BenefrichesHighlights from "./BenefrichesHighlights";
import MutafrichesButton from "./MutafrichesButton";
import MutafrichesHighlights from "./MutafrichesHighlights";

export default function SituationSection() {
  return (
    <section className="bg-white dark:bg-blue-dark py-20" id="votre-projet-d-amenagement">
      <div className="fr-container">
        <SectionTitle>Où en êtes-vous de votre projet d'aménagement ?</SectionTitle>
        <div className="md:grid md:grid-cols-2 gap-6 mt-[60px]">
          <article className="bg-[#EEE9F4] dark:bg-blue-ultradark p-10 rounded-xl">
            <img className="mb-6 h-[100px]" src="/img/pictograms/site-nature/friche.svg" alt="" />
            <h3 className="text-2xl">
              J'ai une friche et je souhaite trouver l'usage le plus adapté.
            </h3>
            <MutafrichesButton />
            <p className="mt-6 mb-2 font-bold">POINTS FORTS :</p>
            <MutafrichesHighlights />
          </article>
          <article className="bg-[#E2EEF3] dark:bg-blue-ultradark p-10 rounded-xl">
            <img className="mb-6 h-[100px]" src="/img/pictograms/all-projects.svg" alt="" />
            <h3 className="text-2xl">
              J'ai un projet sur un site et je souhaite savoir quelles seraient ses retombées.
            </h3>
            <BenefrichesButton />
            <p className="mt-6 mb-2 font-bold">POINTS FORTS :</p>
            <BenefrichesHighlights />
          </article>
        </div>
      </div>
    </section>
  );
}
