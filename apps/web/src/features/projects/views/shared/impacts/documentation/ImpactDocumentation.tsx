import Button from "@codegouvfr/react-dsfr/Button";
import type { MDXProps } from "mdx/types";
import type { ComponentType } from "react";
import { useEffect, useRef, useState } from "react";

import { routes } from "@/app/router";
import classNames from "@/shared/views/clsx";

import Intro from "./content/00-intro.mdx";
import StatuQuo from "./content/01-statuquo.mdx";
import Projet from "./content/02-projet.mdx";
import Agregation from "./content/03-agregation.mdx";
import AnalyseCoutBenefice from "./content/04-analyse-cout-benefice.mdx";
import Beneficiaires from "./content/05-beneficiaires.mdx";
import AnalyseCoutsEvites from "./content/06-analyse-couts-evites.mdx";
import ScoreImpact from "./content/07-score-d-impact.mdx";
import Methodologie from "./content/08-methodologie.mdx";
import { mdxComponents } from "./mdxComponents";

// L'ordre des sections : ids utilisés par le sommaire ET par les liens `#id` des .mdx
const SECTIONS: Record<string, ComponentType<MDXProps>> = {
  statuquo: StatuQuo,
  projet: Projet,
  agregation: Agregation,
  "analyse-cout-benefice": AnalyseCoutBenefice,
  beneficiaires: Beneficiaires,
  "analyse-couts-evites": AnalyseCoutsEvites,
  "score-impacts": ScoreImpact,
  methodologie: Methodologie,
};

const TOC_GROUPS = [
  {
    label: "Calculs",
    items: [
      { id: "statuquo", emoji: "⏸️", label: "Impacts statu quo" },
      { id: "projet", emoji: "🌐", label: "Impacts du projet" },
      { id: "agregation", emoji: "🔀", label: "Agrégation différentielle" },
    ],
  },
  {
    label: "Présentation des résultats",
    items: [
      { id: "analyse-cout-benefice", emoji: "⚖️", label: "Analyse coût-bénéfice" },
      { id: "beneficiaires", emoji: "👥", label: "Répartition par bénéficiaires" },
      { id: "analyse-couts-evites", emoji: "📉", label: "Analyse des coûts évités" },
      { id: "score-impacts", emoji: "🏆", label: "Score d'impacts" },
    ],
  },
  {
    label: "Référence",
    items: [{ id: "methodologie", emoji: "📐", label: "Note méthodologique" }],
  },
];

const ALL_SECTION_IDS = TOC_GROUPS.flatMap(({ items }) => items.map(({ id }) => id));

const MdxSection = ({ id }: { id: keyof typeof SECTIONS }) => {
  const Content = SECTIONS[id];
  if (!Content) return null;
  return (
    <section id={id} className="scroll-mt-20 border p-6 rounded-lg">
      <Content components={mdxComponents} />
    </section>
  );
};

const Sidebar = ({ displayDevelopmentScore }: { displayDevelopmentScore: boolean }) => {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const intersectingIds = new Set<string>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersectingIds.add(entry.target.id);
          } else {
            intersectingIds.delete(entry.target.id);
          }
        });

        const firstVisible = ALL_SECTION_IDS.find((id) => intersectingIds.has(id));
        if (firstVisible) {
          setActiveId(firstVisible);
        }
      },
      {
        rootMargin: "-76px 0px -75% 0px",
        threshold: 0,
      },
    );

    ALL_SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <aside className="hidden lg:block sticky top-16 self-start w-72 shrink-0 border-r pr-4 h-screen">
      <nav className="flex flex-col gap-5 py-6">
        {TOC_GROUPS.map(({ label, items }) => (
          <div key={label}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2 px-3">{label}</p>
            <div className="flex flex-col gap-0.5">
              {items.map(({ id, emoji, label: itemLabel }) => {
                const isActive = activeId === id;
                if (id === "amenagescore" && !displayDevelopmentScore) {
                  return null;
                }
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={classNames(
                      "flex items-center gap-2 p-3 text-sm transition-colors",
                      isActive
                        ? "bg-indigo-100 text-indigo-800 font-semibold  border-indigo-500"
                        : "hover:bg-indigo-50 hover:text-indigo-700",
                    )}
                  >
                    <span>{emoji}</span>
                    <span>{itemLabel}</span>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

const PageTitle = ({
  header = false,
  ref,
}: {
  header?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}) => {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-semibold uppercase tracking-widest text-blue-medium truncate">
        Méthodologie
      </span>
      {!header ? (
        <h1 className="text-3xl font-extrabold leading-tight" ref={ref}>
          Comment sont calculés les impacts ?
        </h1>
      ) : (
        "Comment sont calculés les impacts ?"
      )}
    </div>
  );
};

export default function ImpactsComputationMethodology({
  displayDevelopmentScore = true,
}: {
  displayDevelopmentScore?: boolean;
}) {
  const [isHeaderInViewport, setIsHeaderInViewPort] = useState(false);

  const inlineHeaderRef = (node: HTMLDivElement) => {
    const observer = new IntersectionObserver(([entry]) => {
      const entryIntersecting = entry?.isIntersecting ?? false;
      setIsHeaderInViewPort(entryIntersecting);
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  };

  return (
    <>
      {!isHeaderInViewport && (
        <div className="fixed w-full left-0 top-0 z-10 bg-white dark:bg-black border-b">
          <div className="flex items-center py-4 px-8">
            <div className="fr-container flex justify-between">
              <PageTitle header />
              <Button
                size="small"
                priority="tertiary no outline"
                iconId="fr-icon-bar-chart-box-line"
                linkProps={routes.myEvaluations().link}
                className={classNames("text-(--text-default-grey)")}
              >
                Mes évaluations
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="fr-container">
        <div className="my-10">
          <PageTitle ref={inlineHeaderRef} />
          <div className="mt-3">
            <Intro components={mdxComponents} />
          </div>
        </div>

        <div className="flex gap-12 items-start">
          <Sidebar displayDevelopmentScore={displayDevelopmentScore} />

          <div className="flex-1 min-w-0 space-y-14">
            <h2 className="text-3xl uppercase mb-3">Calculs</h2>
            <MdxSection id="statuquo" />
            <MdxSection id="projet" />
            <MdxSection id="agregation" />

            <h2 className="uppercase mb-8">Présentation des résultats</h2>
            <MdxSection id="analyse-cout-benefice" />
            <MdxSection id="beneficiaires" />
            <MdxSection id="analyse-couts-evites" />

            {displayDevelopmentScore && <MdxSection id="score-impacts" />}

            <MdxSection id="methodologie" />
          </div>
        </div>
      </div>
    </>
  );
}
