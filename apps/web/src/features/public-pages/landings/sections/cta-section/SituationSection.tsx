import {
  BENEFRICHES_HIGHLIGHTS,
  MUTAFRICHES_HIGHLIGHTS,
} from "@/features/public-pages/highlightContent";
import Badge from "@/shared/views/components/Badge/Badge";
import HighlightsList from "@/shared/views/components/HighlightsList/HighlightsList";

import SectionTitle from "../SectionTitle";
import BenefrichesButton from "./AccessBenefrichesButton";
import MutafrichesButton from "./AccessMutafrichesButton";

export default function SituationSection() {
  return (
    <section className="bg-white dark:bg-blue-dark py-20" id="votre-projet-d-amenagement">
      <div className="fr-container">
        <SectionTitle>Où en êtes-vous de votre projet d'aménagement ?</SectionTitle>
        <div className="md:grid md:grid-cols-2 gap-6 mt-[60px]">
          <article className="bg-[#EEE9F4] dark:bg-blue-ultradark p-10 rounded-xl flex flex-col gap-2 items-start">
            <img
              className="mb-6 h-[100px]"
              src="/img/pictograms/evaluations/mutability.svg"
              alt=""
            />
            <h3 className="flex flex-col gap-2">
              <span className="text-sm font-normal">Je souhaite évaluer...</span>
              <span className="text-2xl">
                La compatibilité de ma friche avec des projets potentiels
              </span>
            </h3>
            <MutafrichesButton />
            <HighlightsList items={MUTAFRICHES_HIGHLIGHTS} />
            <Badge style="mutability">Adapté si vous avez juste une friche</Badge>
          </article>
          <article className="bg-[#E2EEF3] dark:bg-blue-ultradark p-10 rounded-xl flex flex-col gap-2 items-start">
            <img className="mb-6 h-[100px]" src="/img/pictograms/evaluations/impacts.svg" alt="" />
            <h3 className="flex flex-col gap-2">
              <span className="text-sm font-normal">Je souhaite évaluer...</span>
              <span className="text-2xl">
                Les impacts socio-économiques d’un projet sur mon site{" "}
              </span>
            </h3>
            <BenefrichesButton />
            <HighlightsList items={BENEFRICHES_HIGHLIGHTS} />
            <Badge style="blue">Adapté si vous avez un site et un projet</Badge>
          </article>
        </div>
      </div>
    </section>
  );
}
