import { ReactNode, useEffect, useRef, useState } from "react";

import classNames, { ClassValue } from "@/shared/views/clsx";
import Accordion from "@/shared/views/components/Accordion/Accordion";
import Badge from "@/shared/views/components/Badge/Badge";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

const SectionTitle = ({
  emoji,
  title,
  subtitle,
  id,
}: {
  emoji: string;
  title: string;
  subtitle?: string;
  id?: string;
}) => (
  <div className="mb-6" id={id}>
    <h3 className="text-xl font-bold  flex items-center gap-2">
      <span>{emoji}</span>
      {title}
    </h3>
    {subtitle && <p className="mt-1 ">{subtitle}</p>}
  </div>
);

const InfoBox = ({
  children,
  variant,
}: {
  children: ReactNode;
  variant: "info" | "warning" | "success" | "neutral" | "error";
}) => {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    success: "bg-green-50 border-green-200 text-green-800",
    neutral: "bg-gray-50 border-gray-200 text-grey-dark",
    error: "bg-red-50 border-red-200 text-red-800",
  };
  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm *:text-sm leading-relaxed ${styles[variant]}`}
    >
      {children}
    </div>
  );
};

const SignBadge = ({ positive }: { positive?: boolean }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium ${
      positive === true
        ? "bg-green-100 text-success-ultradark"
        : positive === false
          ? "bg-red-100 text-error-ultradark"
          : "bg-gray-100"
    }`}
  >
    {positive === true ? "+ Bénéfice" : positive === false ? "- Coût" : "± Variable"}
  </span>
);

const ImpactRow = ({
  label,
  sign,
  note,
  linkTo,
}: {
  label: string;
  sign: "+" | "-" | "±";
  note?: string;
  linkTo?: string;
}) => (
  <li className="flex items-center justify-between gap-4 p-2 border-b border-gray-300 last:border-b-0 min-h-[57px]">
    <span className=" inline-flex items-center">
      <div className="flex flex-col shrink-0">
        {label}
        {note && <span className="text-xs ">{note}</span>}
      </div>
      {linkTo && (
        <a href={`#${linkTo}`} className="ml-1.5 text-xs">
          ↗ détail
        </a>
      )}
    </span>
    <div className="flex flex-col items-end gap-1 shrink-0">
      <SignBadge positive={sign === "+" ? true : sign === "-" ? false : undefined} />
    </div>
  </li>
);

// TODO
const PlaceholderCalc = () => null;
// <div className="mt-4 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 dark:bg-gray-800 p-4">
//   <p className="text-xs font-semibold uppercase tracking-wide  mb-1">Détails du calcul</p>
//   <p className="text-sm  italic">-- À compléter --</p>
// </div>

const InternalLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href}>{children}</a>
);

const ScoreBadge = ({ grade }: { grade: "A" | "B" | "C" | "D" | "E" }) => {
  const palette = {
    A: "bg-development-score-grade-a",
    B: "bg-development-score-grade-b",
    C: "bg-development-score-grade-c",
    D: "bg-development-score-grade-d",
    E: "bg-development-score-grade-e",
  };
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-extrabold text-2xl w-12 h-12 text-white ${palette[grade]}`}
    >
      {grade}
    </span>
  );
};

const CriterionRow = ({
  emoji,
  title,
  condition,
  detail,
}: {
  emoji: string;
  title: string;
  condition: string;
  detail?: ReactNode;
}) => (
  <ImpactGroup className="space-y-3 p-4">
    <div>
      <h3 className="text-xl mb-1">
        <span className="mr-2">{emoji}</span>
        {title}
      </h3>
      <div className="flex items-center gap-2">
        <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-success-ultralight text-success-ultradark text-sm font-medium px-2 py-0.5 shrink-0">
          ✓ Succès si
        </span>
        <p className="mb-0  text-sm">{condition}</p>
      </div>
    </div>
    {detail && <div>{detail}</div>}
  </ImpactGroup>
);

const ImpactGroup = ({ children, className }: { children: ReactNode; className?: ClassValue }) => {
  return (
    <div
      className={classNames(
        "rounded-xl border border-gray-200 bg-white dark:bg-black p-2 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
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
      { id: "amenagescore", emoji: "🏆", label: "AménageScore" },
    ],
  },
  {
    label: "Référence",
    items: [{ id: "methodologie", emoji: "📐", label: "Note méthodologique" }],
  },
];

const ALL_SECTION_IDS = TOC_GROUPS.flatMap(({ items }) => items.map(({ id }) => id));

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

export default function ImpactsEconomiquesDocumentation({
  displayDevelopmentScore = true,
}: {
  displayDevelopmentScore?: boolean;
}) {
  return (
    <div className="[--ul-start:0]">
      <div className="mb-10">
        <span className="text-sm font-semibold uppercase tracking-widest text-blue-medium truncate">
          Documentation
        </span>
        <h1 className="text-3xl font-extrabold  leading-tight">
          Comment sont calculés les impacts économiques ?
        </h1>
        <p className="mt-3 text-base  leading-relaxed">
          Lorsqu'un projet de reconversion de site est analysé, le calcul se déroule en{" "}
          <strong>trois grandes étapes</strong> : on évalue d'abord ce que le site génère
          aujourd'hui (statu quo), puis ce que le nouveau projet produira, et enfin on agrège les
          deux pour obtenir l'analyse coût-bénéfice différentielle présentée dans l'outil.
        </p>
      </div>

      <div className="flex gap-12 items-start">
        <Sidebar displayDevelopmentScore={displayDevelopmentScore} />

        <div className="flex-1 min-w-0 space-y-14">
          <div>
            <h2 className="uppercase">Calculs</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {[
                {
                  id: "statuquo",
                  emoji: "⏸️",
                  step: "Étape 1",
                  title: "Statu quo",
                  desc: "Impacts économiques si le site reste en l'état",
                  color: "border-slate-200 bg-slate-50 dark:bg-slate-900",
                },
                {
                  id: "projet",
                  emoji: "🌐",
                  step: "Étape 2",
                  title: "Projet",
                  desc: "Impacts économiques générés par la reconversion",
                  color: "border-blue-200 bg-blue-50 dark:bg-blue-900",
                },
                {
                  id: "agregation",
                  emoji: "🔀",
                  step: "Étape 3",
                  title: "Agrégation",
                  desc: "Différentiel projet - statu quo = analyse coût-bénéfice",
                  color: "border-indigo-200 bg-indigo-50 dark:bg-indigo-900",
                },
              ].map(({ id, emoji, step, title, desc, color }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`rounded-xl border p-4 shadow-sm hover:shadow-md transition-all block ${color}`}
                >
                  <div className="text-xs font-bold uppercase tracking-wide  mb-1">{step}</div>
                  <div className="text-2xl mb-1">{emoji}</div>
                  <p className="font-semibold text-sm  uppercase">{title}</p>
                  <p className="mt-1 text-xs ">{desc}</p>
                </a>
              ))}
            </div>
            <InfoBox variant="info">
              <strong>Pourquoi séparer statu quo et projet ?</strong>
              <br />
              Calculer les impacts de chacun des scénario indépendamment permet de les présenter
              séparément dans des vues dédiées.
              <ul className="pl-4">
                <li>
                  Les onglets « analyse coût-bénéfice » et « aménag'score » présentent une analyse
                  différentielle des deux scénarios « statu quo » et « projet » (aggrégation)
                </li>
                <li>
                  La partie « coût de l'inaction » de l'onglet « analyse des coûts évités » présente
                  une comparaison des deux scénarios « statu quo » et « projet »
                </li>
                <li>
                  La partie « coût de l'extension urbaine » de l'onglet « analyse des coûts évités »
                  présente une comparaison des deux scénarios « projet sur site » + « statu quo sur
                  site fictif » d'un côté et « projet sur site fictif » + « statu quo sur site » de
                  l'autre
                </li>
              </ul>
            </InfoBox>
          </div>
          <section id="statuquo" className="scroll-mt-20">
            <SectionTitle
              emoji="⏸️"
              title="Impacts économiques du statu quo"
              subtitle="Que se passerait-il si le site restait en l'état ? Ce calcul établit la situation de référence : les coûts et revenus actuels du site, avant toute reconversion."
            />

            <InfoBox variant="neutral">
              <strong>Rôle dans le calcul global :</strong> ces impacts statu quo seront ensuite{" "}
              <strong>inversés</strong> lors de l'agrégation{" "}
              <InternalLink href="#agregation">(voir Étape 3)</InternalLink>.
              <p className="mb-0">
                Reconvertir le site, c'est renoncer à ce que le site génère aujourd'hui, ce
                renoncement devient donc un coût, ou un bénéfice s'il s'agissait d'une charge.
              </p>
            </InfoBox>

            <div className="mt-4 space-y-3">
              <Accordion label="🏚️ Coûts de maintien d'une friche">
                <div className="space-y-4 pt-1">
                  <p className="">
                    Tant que la friche existe, son propriétaire (ou locataire) supporte des dépenses
                    récurrentes : gardiennage, clôtures, gestion des dépôts sauvages, couverture des
                    accidents. Ces coûts sont calculés sur le site en l'état actuel.
                  </p>
                  <ImpactGroup>
                    <ul className="my-0">
                      <ImpactRow
                        label="Coûts de sécurisation et maintenance à la charge du propriétaire"
                        sign="-"
                        note="Calculés annuellement, actualisés sur la durée d'évaluation"
                      />
                      <ImpactRow
                        label="Coûts de sécurisation à la charge du locataire (si applicable)"
                        sign="-"
                      />
                    </ul>
                  </ImpactGroup>
                  <InfoBox variant="info">
                    Ces coûts statu quo deviennent des <strong>économies réalisées</strong> dans la
                    vue agrégée : reconvertir la friche, c'est ne plus avoir à les payer.{" "}
                    <InternalLink href="#agregation">→ Voir l'agrégation</InternalLink>
                  </InfoBox>
                  <PlaceholderCalc />
                </div>
              </Accordion>

              <Accordion label="🔑 Revenus locatifs actuels">
                <div className="space-y-4 pt-1">
                  <p className="">
                    Si le site actuel génère un loyer (terrain loué à un exploitant agricole,
                    bâtiment loué…), ce revenu est comptabilisé dans le statu quo.
                  </p>
                  <ImpactGroup>
                    <ul className="my-0">
                      <ImpactRow
                        label="Loyer perçu par le propriétaire actuel"
                        sign="+"
                        note="Actualisé sur la durée d'évaluation"
                      />
                    </ul>
                  </ImpactGroup>
                  <InfoBox variant="warning">
                    Ce revenu statu quo deviendra une <strong>perte</strong> dans la vue agrégée ({" "}
                    <em>oldRentalIncomeLoss</em>)&nbsp;: reconvertir le site signifie renoncer à ce
                    loyer. <InternalLink href="#agregation">→ Voir l'agrégation</InternalLink>
                  </InfoBox>
                  <PlaceholderCalc />
                </div>
              </Accordion>

              <Accordion label="💼 Bilan d'exploitation du site actuel">
                <div className="space-y-4 pt-1">
                  <p className="">
                    Si le site est actuellement exploité (activité agricole, industrielle…), son
                    bilan d'exploitation annuel est calculé&nbsp;: recettes moins charges courantes.
                  </p>
                  <ImpactGroup>
                    <ul className="my-0">
                      <ImpactRow
                        label="Recettes d'exploitation annuelles du site actuel"
                        sign="+"
                      />
                      <ImpactRow label="Charges d'exploitation annuelles du site actuel" sign="-" />
                    </ul>
                  </ImpactGroup>
                  <InfoBox variant="warning">
                    Ce bilan devient une <strong>perte de bénéfice</strong> dans la vue agrégée si
                    le solde était positif. Si l'exploitation était déficitaire, la reconversion
                    engendre au contraire un gain.
                  </InfoBox>
                  <PlaceholderCalc />
                </div>
              </Accordion>

              <Accordion label="🌱 Services écosystémiques">
                <div className="space-y-4 pt-1">
                  <p className="">
                    Les services écosystémiques rendus par les sols (prairies, forêts, zones
                    humides) sont pris en compte dans les impacts du site. Afin de pouvoir comparer
                    les valeurs de ces indicateurs aux autres impacts monétaires, il est nécessaire
                    de convertir celles qui ne sont naturellement pas exprimées en valeurs
                    monétaires. On parle alors de ”monétarisation”.
                  </p>
                  {/* <ImpactGroup>
                    <ul className="my-0">
                      <ImpactRow label="" sign="+" />
                      <ImpactRow label="" sign="-" />
                    </ul>
                  </ImpactGroup> */}
                  <InfoBox variant="warning">
                    Dans les impacts d'un site statu quo, cette valeur sera toujours un bénéfice.
                  </InfoBox>
                  <PlaceholderCalc />
                </div>
              </Accordion>
            </div>
          </section>
          <section id="projet" className="scroll-mt-20  space-y-4">
            <SectionTitle
              emoji="🌐"
              title="Impacts économiques du projet"
              subtitle="Quels effets le nouveau projet génère-t-il sur les collectivités, les riverains et la société ? Ces impacts sont calculés indépendamment du statu quo et se découpent en 3 parties : le bilan de dévelopement (installation du projet), le bilan d'exploitation et les impacts socio-économiques générés par la reconversion."
            />
            <section id="bilan-developpement" className="scroll-mt-20">
              <Accordion label="🏗️ Bilan de développement">
                <span className="text-sm">
                  Ce que le porteur de projet dépense et perçoit au moment de construire le projet
                  (opérations non récurrentes, comptabilisées une seule fois).
                </span>

                <div className="my-4 flex flex-col gap-4">
                  <ImpactGroup className="p-5">
                    <p className="font-semibold text-error-ultradark mb-1">Dépenses</p>
                    <ul className="my-0">
                      <ImpactRow
                        label="Coûts d'installation (études, travaux, équipements)"
                        sign="-"
                      />
                      <ImpactRow
                        label="Coûts de réhabilitation du site"
                        sign="-"
                        note="Uniquement si le porteur de projet gère aussi la réhabilitation"
                      />
                      <ImpactRow
                        label="Achat du terrain"
                        sign="-"
                        note="Toujours inclus pour un projet urbain ; sinon uniquement si le développeur devient propriétaire"
                      />
                    </ul>
                  </ImpactGroup>
                  <ImpactGroup className="p-5">
                    <p className="font-semibold text-success-ultradark mb-1">Revenus</p>
                    <ul className="my-0">
                      <ImpactRow label="Revente du terrain" sign="+" />
                      <ImpactRow label="Revente des bâtiments" sign="+" />
                      <ImpactRow
                        label="Subventions liées à la réhabilitation"
                        sign="+"
                        note="Uniquement si le porteur de projet gère aussi la réhabilitation"
                      />
                    </ul>
                  </ImpactGroup>
                  <InfoBox variant="neutral">
                    Le <strong>total du bilan de développement</strong> est la somme de toutes ces
                    dépenses et tous ces revenus. Un résultat positif indique un gain financier net
                    pour le développeur lors de la phase de création.
                  </InfoBox>
                </div>
              </Accordion>
            </section>

            <section id="bilan-exploitation" className="scroll-mt-20">
              <Accordion label="🔄 Bilan d'exploitation">
                <span className="text-sm">
                  Les flux financiers annuels (loyers, charges, recettes) cumulés sur toute la durée
                  de vie du projet.
                </span>

                <div className="my-4 space-y-4">
                  <ImpactGroup>
                    <ul className="my-0">
                      <ImpactRow
                        label="Charges d'exploitation annuelles (loyers, maintenance, etc.)"
                        sign="-"
                      />
                      <ImpactRow
                        label="Produits d'exploitation annuels (revenus, loyers perçus, etc.)"
                        sign="+"
                      />
                    </ul>
                  </ImpactGroup>
                  <InfoBox variant="info">
                    <strong>Pourquoi « actualiser » ?</strong> Un même montant reçu dans 20 ans a
                    moins de valeur aujourd'hui. L'actualisation financière permet de ramener toutes
                    les valeurs futures à leur équivalent en euros d'aujourd'hui.{" "}
                    <InternalLink href="#methodologie">→ Note méthodologique</InternalLink>
                  </InfoBox>
                </div>
              </Accordion>
            </section>

            <InfoBox variant="neutral">
              <strong>Où apparaît ce bilan ?</strong>
              <p className="mb-0">
                Selon le profil de l'exploitant, ce bilan est intégré soit au{" "}
                <InternalLink href="#bilan-developpement">bilan de développement</InternalLink> (si
                l'exploitant et l'aménageur sont le même acteur), soit aux impacts indirects du
                projet (si l'exploitant est une collectivité locale).
              </p>
            </InfoBox>

            <div className="space-y-3">
              <Accordion label="📋 Droits de mutation">
                <div className="space-y-4 pt-1">
                  <p className="">
                    Chaque transaction immobilière liée au projet (achat ou revente du terrain,
                    revente des bâtiments) génère des <strong>droits de mutation</strong>, soit des
                    taxes perçues par les collectivités locales au moment de la transaction.
                  </p>
                  <ImpactGroup>
                    <ul className="my-0">
                      <ImpactRow
                        label="Droits de mutation sur l'achat du terrain"
                        sign="+"
                        note="s'il y a eu acquisition du terrain avant reconversion"
                      />
                      <ImpactRow
                        label="Droits de mutation sur la revente du terrain"
                        sign="+"
                        note="si le site est revendu après reconversion"
                      />
                      <ImpactRow
                        label="Droits de mutation sur la revente des bâtiments"
                        sign="+"
                        note="si les bâtiments sont revendus après reconversion"
                      />
                    </ul>
                  </ImpactGroup>
                  <InfoBox variant="neutral">
                    Ces droits sont comptabilisés <strong>une seule fois en année 0</strong>, au
                    moment des transactions.
                  </InfoBox>
                  <PlaceholderCalc />
                </div>
              </Accordion>
              <Accordion label="🏠 Nouveau revenu locatif du projet">
                <div className="space-y-4 pt-1">
                  <p className="">
                    Si le projet prévoit un loyer (terrain ou bâtiment loué à l'exploitant), ce
                    nouveau revenu locatif est comptabilisé côté projet.
                  </p>
                  <ImpactGroup>
                    <ul className="my-0">
                      <ImpactRow
                        label="Loyer projeté versé par l'exploitant du nouveau projet"
                        sign="+"
                        note="actualisé sur la durée d'évaluation"
                      />
                    </ul>
                  </ImpactGroup>
                  <InfoBox variant="neutral">
                    Ce revenu est combiné avec la perte du loyer statu quo lors de l'agrégation pour
                    obtenir la variation nette.{" "}
                    <InternalLink href="#agregation">→ Voir l'agrégation</InternalLink>
                  </InfoBox>
                  <PlaceholderCalc />
                </div>
              </Accordion>

              <Accordion label="🌱 Conservation des sols et de la nature">
                <div className="space-y-4 pt-1">
                  <p className="">
                    La reconversion modifie la qualité et l'usage des sols. Ce module compare les
                    sols du site actuel avec les sols du projet pour évaluer l'impact
                    environnemental en termes monétaires.
                  </p>
                  <p>
                    Le sol, quand il n'a pas été artificialisé, est un milieu vivant, en perpétuel
                    renouvellement. Sa création prend plusieurs centaines d'année (pour quelques
                    centimètres de sol en conditions naturelles), mais il peut être détruit en
                    quelques secondes (ex : décapage de la terre végétale sur 30cm).
                  </p>
                  <p>
                    Les sols et les végétaux stockent une grande quantité de carbone. A l'échelle
                    globale, ces réservoirs de carbone stockent, dans la matière organique des sols,
                    la litière et la biomasse vivante ou morte (y compris les produits matériaux
                    issus de la biomasse), 3 à 4 fois plus de carbone que l'atmosphère !
                  </p>

                  <strong>Quelles données sont utilisées dans le calcul ?</strong>
                  <br />
                  <strong> Données systémiques agrégées par Bénéfriches :</strong>
                  <ul className="ml-4">
                    <li>
                      Stocks de référence en carbone contenu dans les différents types de sols (ex :
                      prairies, forêts, cultures, sols artificialisés) à l'hectare (exprimés en kg
                      éq. C/hectare).
                    </li>
                  </ul>
                  <strong>Données du site</strong>
                  <p>
                    Les données du site peuvent avoir été saisies par l'utilisateur·ice ou avoir été
                    suggérées par Bénéfriches sur la base d'une moyenne ou d'une hypothèse. Il
                    s'agit de la surface occupée par chaque type de sol du site (exprimée en
                    hectare).
                  </p>

                  <strong>Données du projet</strong>
                  <p>
                    Les données du projet peuvent avoir été saisies par l'utilisateur·ice ou avoir
                    été suggérées par Bénéfriches sur la base d'une moyenne ou d'une hypothèse. Il
                    s'agit de la surface occupée par chaque type de sol du projet (exprimée en
                    hectare).
                  </p>

                  <strong>Comment est fait le calcul ?</strong>
                  <p>
                    La quantité de carbone stockée dans les sols du site (exprimé en kg éq. C) est
                    la somme, pour chacun des sols rencontrés sur le site, du produit du stock de
                    référence associé à un type de sols (exprimé en kg éq. C/hectare) par la surface
                    occupée par ce type de sol (exprimée en hectare).
                  </p>
                  <strong>Sources</strong>
                  <ul className="ml-4">
                    <li>
                      <ExternalLink href="https://aldo-carbone.ademe.fr/">
                        Stocks de référence en carbone contenu dans les différents types de sols
                        (ex&nbsp;: prairies, forêts, cultures, sols artificialisés) à l'hectare
                        (exprimés en kg éq. C/hectare)
                      </ExternalLink>
                    </li>
                  </ul>
                  <strong>Aller plus loin</strong>
                  <ul className="ml-4">
                    <li>
                      <ExternalLink href="https://librairie.ademe.fr/recherche-et-innovation/6821-la-sante-des-sols-urbains-au-service-de-l-amenagement-des-villes-et-des-territoires.html">
                        ADEME «&nbsp;La santé des sols urbains au service de l'aménagement des
                        villes et des territoires&nbsp;», 2024,
                      </ExternalLink>
                    </li>
                  </ul>

                  <ImpactGroup>
                    <ul className="my-0">
                      <ImpactRow
                        label="Stockage de CO₂ dans les sols"
                        sign="±"
                        note="Positif si la végétalisation augmente, négatif sinon"
                      />
                      <ImpactRow
                        label="Autres indicateurs de qualité naturelle des sols"
                        sign="±"
                        note="Seuls les indicateurs qui changent réellement entre les deux situations sont pris en compte"
                      />
                    </ul>
                  </ImpactGroup>

                  <InfoBox variant="info">
                    Les valeurs sont calculées en utilisant la{" "}
                    <strong>valeur tutélaire du CO₂</strong> et un taux d'actualisation.{" "}
                    <InternalLink href="#methodologie">→ Note méthodologique</InternalLink>
                  </InfoBox>
                  <PlaceholderCalc />
                </div>
              </Accordion>

              <Accordion label="☀️ Impacts spécifiques aux projets photovoltaïques">
                <div className="space-y-4 pt-1">
                  <InfoBox variant="warning">
                    Ces impacts s'appliquent{" "}
                    <strong>uniquement aux projets de centrale photovoltaïque</strong>.
                  </InfoBox>
                  <ImpactGroup>
                    <ul className="my-0">
                      <ImpactRow
                        label="CO₂ évité grâce à la production d'énergie solaire"
                        sign="+"
                        note="Production (MWh) convertie en tonnes de CO₂ évitées, monétisée via la valeur tutélaire du carbone"
                      />
                      <ImpactRow
                        label="Taxes locales payées par l'exploitant (IFER, CFE…)"
                        sign="+"
                        note="Perçues par les collectivités locales"
                      />
                    </ul>
                  </ImpactGroup>
                  <InfoBox variant="info">
                    La <strong>valeur tutélaire du carbone</strong> augmente progressivement dans le
                    temps. <InternalLink href="#methodologie">→ Note méthodologique</InternalLink>
                  </InfoBox>
                  <PlaceholderCalc />
                </div>
              </Accordion>

              <Accordion label="🏙️ Impacts spécifiques aux projets urbains">
                <div className="space-y-4 pt-1">
                  <InfoBox variant="warning">
                    Ces impacts s'appliquent{" "}
                    <strong>uniquement aux projets de requalification urbaine</strong> et{" "}
                    <strong>uniquement si le site était une friche</strong>.
                  </InfoBox>

                  <div>
                    <p className="font-semibold  mb-2">
                      🏡 Valorisation immobilière des biens voisins
                    </p>
                    <p className="text-sm  mb-2">
                      La suppression de la friche augmente la valeur des biens immobiliers alentour,
                      générant également une hausse des droits de mutation futurs.
                    </p>
                    <ImpactGroup>
                      <ul className="my-0">
                        <ImpactRow
                          label="Hausse de la valeur immobilière des biens voisins"
                          sign="+"
                        />
                        <ImpactRow
                          label="Hausse des droits de mutation liée à cette valorisation"
                          sign="+"
                        />
                      </ul>
                    </ImpactGroup>
                    <PlaceholderCalc />
                  </div>

                  <div>
                    <p className="font-semibold  mb-2">🌳 Fraîcheur urbaine</p>
                    <p className="text-sm  mb-2">
                      La végétalisation du site réduit les îlots de chaleur urbains.
                    </p>
                    <ImpactGroup>
                      <ul className="my-0">
                        <ImpactRow
                          label="CO₂ évité grâce à la réduction de la climatisation"
                          sign="+"
                        />
                        <ImpactRow
                          label="Économies sur les factures de climatisation des résidents"
                          sign="+"
                        />
                      </ul>
                      <PlaceholderCalc />
                    </ImpactGroup>
                  </div>

                  <div>
                    <p className="font-semibold  mb-2">🚗 Déplacements (mobilité)</p>
                    <p className="text-sm  mb-2">
                      La densification urbaine réduit les distances parcourues en voiture.
                    </p>
                    <ImpactGroup>
                      <p className="p-2">
                        On calcule un nombre de kilomètres évités, dont découlent plusieurs
                        estimations monétaires
                      </p>

                      <PlaceholderCalc />

                      <ul className="my-0">
                        <ImpactRow
                          label="Frais automobiles évités (carburant, entretien…)"
                          sign="+"
                          note="grâce aux kilomètres évités"
                        />
                        <ImpactRow
                          label="CO₂ du trafic routier évité"
                          sign="+"
                          note="pondéré par l'évolution du CO2 émis par les véhicules dans le temps, la valeur monétaire du CO2 et l'actualisation"
                        />
                        <ImpactRow
                          label="Coûts de santé liés à la pollution atmosphérique évités"
                          sign="+"
                          note="grâce aux kilomètres évités"
                        />{" "}
                        <ImpactRow
                          label="Dommages matériels évités"
                          sign="+"
                          note="grâce aux accidents de la route évités"
                        />
                        <ImpactRow
                          label="Blessures légères évitées"
                          sign="+"
                          note="grâce aux accidents de la route évités"
                        />
                        <ImpactRow
                          label="Blessures graves évitées"
                          sign="+"
                          note="grâce aux accidents de la route évités"
                        />
                        <ImpactRow
                          label="Décès évités (valeur statistique de la vie humaine)"
                          sign="+"
                          note="grâce aux accidents de la route évités"
                        />{" "}
                        <ImpactRow
                          label="Valeur du temps de trajet économisé"
                          sign="+"
                          note="grâce aux kilomètres évités"
                        />
                      </ul>
                    </ImpactGroup>
                  </div>

                  <div>
                    <p className="font-semibold  mb-2">🏛️ Nouvelles taxes liées aux usages créés</p>
                    <ImpactGroup>
                      <ul className="my-0">
                        <ImpactRow
                          label="Taxe foncière sur les nouveaux logements construits"
                          sign="+"
                          note="calculée sur la surface de logements du projet"
                        />
                        <ImpactRow
                          label="Cotisation foncière des entreprises (bureaux)"
                          sign="+"
                          note="calculée sur la surface de bureaux du projet"
                        />
                      </ul>
                    </ImpactGroup>
                  </div>

                  <div>
                    <p className="font-semibold  mb-2">🛣️ Voirie et réseaux</p>
                    <p className="text-sm  mb-2">
                      La reconversion d'une friche en projet urbain crée de nouveaux besoins en
                      voirie et réseaux. Ces dépenses sont à la charge de la collectivité.
                    </p>
                    <ImpactGroup className="mb-2">
                      <ul className="my-0">
                        <ImpactRow
                          label="Nouvelles dépenses annuelles de voirie et réseaux"
                          sign="-"
                          note="à partir de l'année 1"
                        />
                      </ul>
                    </ImpactGroup>

                    <InfoBox variant="neutral">
                      <strong>Cas particulier dans la vue « Étalement urbain » :</strong> ces
                      dépenses sont transformées en économies comparatives (
                      <em>coût de construction de VRD évités</em> et{" "}
                      <em>coût de maintenance de VRD évités</em>) pour comparer avec un scénario de
                      construction en périphérie.
                    </InfoBox>
                  </div>

                  <PlaceholderCalc />
                </div>
              </Accordion>
            </div>
          </section>
          <section id="agregation" className="scroll-mt-20">
            <SectionTitle
              emoji="🔀"
              title="Agrégation : la vue différentielle"
              subtitle="Les impacts statu quo et les impacts projet sont combinés pour produire les valeurs affichées dans l'analyse coût-bénéfice. La logique est celle d'une comparaison : qu'est-ce que la reconversion change, en mieux ou en pire ?"
            />

            <div className="space-y-4">
              <InfoBox variant="info">
                <strong>Principe clé :</strong> les impacts statu quo sont <strong>inversés</strong>{" "}
                avant d'être additionnés aux impacts projet. Reconvertir le site, c'est renoncer à
                ce qu'il générait (coûts ou revenus). Un coût statu quo devient donc un{" "}
                <em>bénéfice évité</em>, et un revenu statu quo devient une <em>perte</em>.
              </InfoBox>

              <div className="rounded-xl border border-gray-200 bg-white dark:bg-black overflow-hidden shadow-sm">
                <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200">
                  <p className="font-semibold ">Table de correspondance statu quo → agrégé</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    {
                      statuquo: "Coût de maintenance de la friche à la charge du propriétaire",
                      agrege: "Coût de maintenance évités pour le propriétaire",
                    },
                    {
                      statuquo: "Coût de maintenance de la friche à la charge du locataire",
                      agrege: "Coût de maintenance évités pour le locataire",
                    },
                    {
                      statuquo: "Revenu locatif",
                      agrege: "Perte de revenu locatif",
                    },
                    {
                      statuquo: "Bénéfice d'exploitation (bilan ± dans statu quo)",
                      agrege: "Perte de bénéfice d'exploitation (±)",
                    },
                  ].map(({ statuquo, agrege }) => (
                    <div key={agrege} className="px-5 py-3 grid grid-cols-11 items-start">
                      <div className="col-span-5">
                        <span className="text-xs  bg-gray-100  dark:bg-gray-800 rounded px-1 py-0.5">
                          {statuquo}
                        </span>
                      </div>
                      <div className="col-span-1 text-center  font-bold pt-0.5">→</div>
                      <div className="col-span-5">
                        <span className="text-xs text-indigo-700 bg-indigo-50 rounded px-1 py-0.5">
                          {agrege}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="px-5 py-3">
                    <p className="text-xs ">
                      + Tous les impacts projet sont ajoutés directement (
                      <InternalLink href="#projet">voir Étape 2</InternalLink>)
                    </p>
                  </div>
                </div>
              </div>

              <InfoBox variant="neutral">
                <strong>Résultat :</strong> l'agrégat final est la liste complète utilisée par
                l'analyse coût-bénéfice et l'AménageScore. C'est sur cet agrégat que sont calculés
                les totaux par bénéficiaire (collectivité, riverains, société).
              </InfoBox>
            </div>
          </section>

          <h2 className="uppercase mb-8">Présentation des résultats</h2>

          <section id="analyse-cout-benefice" className="scroll-mt-20">
            <SectionTitle
              emoji="⚖️"
              title="Analyse coût-bénéfice"
              subtitle="Cette vue synthétise l'ensemble des impacts agrégés en un graphique d'équilibre et détaille les effets par bénéficiaire."
            />

            <p className="  leading-relaxed mb-4">
              Le graphique « analyse coût-bénéfice » montre, année par année, la somme cumulée de
              tous les impacts financiers. Il permet d'identifier le{" "}
              <strong>point d'équilibre</strong>&nbsp;: l'année à partir de laquelle les impacts
              économiques engendrés par le projet compense le bilan de l'opération.
            </p>
            <div className="rounded-lg bg-gray-50  dark:bg-gray-800 border border-gray-200 p-4 space-y-2">
              <p className="text-xs font-semibold  uppercase tracking-wide mb-2">
                Ce qui est inclus dans la courbe
              </p>
              <ul className="space-y-2 text-sm ">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 inline-block w-3 h-3 rounded-sm bg-indigo-500"></span>
                  <span>
                    <strong>Bilan de développement</strong> - décalage initial dès l'année 0.{" "}
                    <InternalLink href="#bilan-developpement">→ Voir le détail</InternalLink>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 inline-block w-3 h-3 rounded-sm bg-blue-400"></span>
                  <span>
                    <strong>Impacts agrégés</strong> (statu quo inversé + projet), accumulés chaque
                    année pour l'ensemble des acteurs.{" "}
                    <InternalLink href="#agregation">→ Voir l'agrégation</InternalLink>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 inline-block w-3 h-3 rounded-sm bg-teal-400"></span>
                  <span>
                    <strong>Bilan d'exploitation</strong>, inclus si l'exploitant est une
                    collectivité ou s'il est le même acteur que le développeur.{" "}
                    <InternalLink href="#bilan-exploitation">→ Voir le détail</InternalLink>
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section id="beneficiaires" className="scroll-mt-20">
            <SectionTitle
              emoji="👥"
              title="Répartition par bénéficiaire"
              subtitle="Les impacts sont répartis par « bénéficiaires », ce sont les personnes ou entités directement impactés."
            />
            <div className="space-y-3">
              {(
                [
                  {
                    emoji: "🏛️",
                    title: "Collectivité locale",
                    items: [
                      {
                        label: "Économies friche (coûts statu quo évités)",
                        sign: "+",
                        linkTo: "statuquo",
                      },
                      {
                        label: "Recettes fiscales (droits de mutation, taxes nouvelles usages…)",
                        sign: "+",
                        linkTo: "projet",
                      },
                      {
                        label: "Bénéfices d'exploitation (si exploitant = collectivité)",
                        sign: "±",
                      },
                      {
                        label: "Revenus locatifs nets (nouveau loyer - perte loyer actuel)",
                        sign: "±",
                      },
                      { label: "Dépenses voirie et réseaux", sign: "-", linkTo: "projet" },
                    ],
                    bg: "bg-blue-50 border-blue-100",
                    header: "text-blue-900",
                  },
                  {
                    emoji: "🏘️",
                    title: "Riverains et entreprises locales",
                    items: [
                      {
                        label: "Économies friche (coûts statu quo évités)",
                        sign: "+",
                        linkTo: "statuquo",
                      },
                      {
                        label: "Pouvoir d'achat (mobilité, climatisation…)",
                        sign: "+",
                        linkTo: "projet",
                      },
                      { label: "Revenus locatifs nets", sign: "±" },
                      {
                        label: "Hausse de la valeur patrimoniale",
                        sign: "+",
                        linkTo: "projet",
                      },
                    ],
                    bg: "bg-pink-50 border-pink-100",
                    header: "text-pink-900",
                  },
                  {
                    emoji: "🌍",
                    title: "Société française et mondiale",
                    items: [
                      {
                        label: "Économies de santé (accidents, pollution de l'air)",
                        sign: "+",
                        linkTo: "projet",
                      },
                      {
                        label: "Valeur environnementale (CO₂, services écosystémiques…)",
                        sign: "+",
                        linkTo: "projet",
                      },
                    ],
                    bg: "bg-green-50 border-green-100",
                    header: "text-green-900",
                  },
                ] as const
              ).map(({ emoji, title, items, bg, header }) => (
                <div
                  key={title}
                  className="rounded-xl border bg-white dark:bg-black overflow-hidden shadow-sm"
                >
                  <div className={`flex items-center gap-3 px-5 py-3 border-b ${bg}`}>
                    <span aria-hidden="true" className="text-xl">
                      {emoji}
                    </span>
                    <span className={`font-semibold text-sm ${header}`}>{title}</span>
                  </div>

                  <ul className="my-0 px-4">
                    {items.map((item) => (
                      <ImpactRow key={item.label} {...item} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section id="analyse-couts-evites" className="scroll-mt-20">
            <SectionTitle
              emoji="📉"
              title="Analyse des coûts évités"
              subtitle="Deux vues comparatives qui répondent à la question : qu'est-ce qu'il en coûte de ne rien faire, ou de construire ailleurs ? Chaque vue affiche deux scénarios côte à côte avec le même cadre de calcul."
            />

            <div className="space-y-8">
              <div id="cout-inaction" className="scroll-mt-20">
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="font-semibold mb-0 text-lg">
                    Projet sur site vs. site conservé en l'état
                  </h4>{" "}
                  <Badge small style="mutability">
                    Coût de l'inaction
                  </Badge>
                </div>

                <p className="text-sm  leading-relaxed mb-4">
                  Cette vue met en regard le projet de reconversion avec le scénario où{" "}
                  <strong>rien n'est fait</strong> : le site reste une friche, une exploitation
                  agricole ou un espace naturel.
                </p>
                <p className="text-sm  leading-relaxed mb-4">
                  Elle permet de quantifier le « coût de l'inaction », c'est à dire ce que la
                  collectivité et la société perdent chaque année en laissant le site en l'état.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="rounded-xl border border-gray-200 bg-white dark:bg-black p-4 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wide  mb-2">
                      Colonne gauche - Projet sur site
                    </p>
                    <ul className="space-y-1 text-sm ">
                      <li className="flex items-start gap-2">
                        <span className="text-success-ultradark shrink-0">▸</span>
                        <span>
                          <strong>Bilan de l'opération</strong> ={" "}
                          <InternalLink href="#bilan-developpement">
                            bilan de développement
                          </InternalLink>{" "}
                          du projet
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-success-ultradark shrink-0">▸</span>
                        <span>
                          <strong>Impacts socio-économiques</strong> = impacts directs du projet (
                          <InternalLink href="#projet">voir Étape 2</InternalLink>)
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-[#69426A] bg-[#E4D8E4] p-4 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#69426A] mb-2">
                      Colonne droite - Statu quo sur site (inaction)
                    </p>
                    <ul className="space-y-1 text-sm text-[#69426A]">
                      <li className="flex items-start gap-2">
                        <span className=" shrink-0">▸</span>
                        <span>
                          <strong>Bilan de l'opération</strong> = 0 € (aucune opération lancée)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="shrink-0">▸</span>
                        <span>
                          <strong>Impacts socio-économiques</strong> = impacts du site en l'état (
                          <InternalLink href="#statuquo">voir Étape 1</InternalLink>)
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <InfoBox variant="info">
                  <strong>Lecture du tableau :</strong> les deux colonnes utilisent exactement le
                  même calcul (statu quo et projet calculés séparément,{" "}
                  <InternalLink href="#agregation">sans agrégation différentielle</InternalLink>
                  ). La comparaison est directe : on voit ce que chaque scénario génère ou coûte
                  annuellement, par bénéficiaire.
                </InfoBox>

                <div className="mt-4 rounded-xl border border-gray-200 bg-white dark:bg-black overflow-hidden shadow-sm">
                  <div className="px-5 py-4 bg-gray-50  dark:bg-gray-800 border-b border-gray-200 font-semibold text-sm ">
                    Détail des lignes affichées par bénéficiaire
                  </div>
                  <div className="divide-y divide-gray-100 text-sm">
                    {[
                      {
                        section: "🏛️ Collectivité locale",
                        rows: [
                          {
                            label: "🏚️ Dépenses liées à la friche",
                            left: "-",
                            right: "coûts statu quo (friche)",
                          },
                          {
                            label: "🔧 Dépenses communales",
                            left: "nouvelles dépenses projet",
                            right: "dépenses statu quo",
                          },
                          {
                            label: "🏛 Recettes fiscales",
                            left: "taxes projet (IFER, CFE, foncier…)",
                            right: "taxes statu quo",
                          },
                          {
                            label: "💰 Bénéfice d'exploitation",
                            left: "bilan d'exploitation projet",
                            right: "bilan d'exploitation statu quo",
                          },
                          {
                            label: "🔑 Revenu locatif",
                            left: "loyer projeté",
                            right: "loyer actuel",
                          },
                        ],
                      },
                      {
                        section: "🏘️ Riverains",
                        rows: [
                          {
                            label: "🏚️ Dépenses liées à la friche",
                            left: "-",
                            right: "coûts statu quo",
                          },
                          {
                            label: "👛 Pouvoir d'achat supplémentaire",
                            left: "mobilité, climatisation…",
                            right: "-",
                          },
                          {
                            label: "💰 Bénéfice d'exploitation",
                            left: "exploitation projet",
                            right: "exploitation statu quo",
                          },
                          {
                            label: "🔑 Revenu locatif",
                            left: "loyer projeté",
                            right: "loyer actuel",
                          },
                          {
                            label: "🏡 Valeur patrimoniale",
                            left: "hausse autour de la friche",
                            right: "-",
                          },
                        ],
                      },
                      {
                        section: "🌍 Société",
                        rows: [
                          {
                            label: "🫀 Économies santé",
                            left: "dépenses évitées (accidents, pollution)",
                            right: "-",
                          },
                          {
                            label: "🌿 Action environnementale",
                            left: "CO₂ évité, services écosyst. projet",
                            right: "services écosyst. statu quo",
                          },
                        ],
                      },
                    ].map(({ section, rows }) => (
                      <div key={section}>
                        <div className="px-5 py-4 bg-gray-50  dark:bg-gray-700 font-semibold   uppercase tracking-wide">
                          {section}
                        </div>
                        {rows.map(({ label, left, right }) => (
                          <div key={label} className="px-5 py-3 grid grid-cols-3 gap-4 items-start">
                            <span className=" font-medium">{label}</span>
                            <span className="text-blue-dark">{left}</span>
                            <span className="text-[#69426A]">{right}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-3 bg-gray-50  dark:bg-gray-800 border-t border-gray-200 grid grid-cols-3 gap-4 font-bold ">
                    <span>Ligne</span>
                    <span className="text-blue-dark">Projet sur site</span>
                    <span className="text-[#69426A]">Statu quo sur site (inaction)</span>
                  </div>
                </div>
              </div>

              <div id="cout-etalement-urbain" className="space-y-4 scroll-mt-20">
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="font-semibold mb-0 text-lg">
                    Construire ici vs. construire ailleurs
                  </h4>{" "}
                  <Badge small className="bg-[#F2F3EC] text-[#505134]">
                    Coût de l'étalement urbain
                  </Badge>
                </div>

                <p className="text-sm  leading-relaxed mb-4">
                  Cette vue compare deux manières de répondre au même besoin d'urbanisation :{" "}
                  <strong>construire sur le site existant</strong> (friche, terrain agricole…) ou{" "}
                  <strong>construire sur un terrain vierge en périphérie</strong> (étalement
                  urbain).
                </p>

                <p className="text-sm  leading-relaxed mb-4">
                  Elle montre le coût supplémentaire qu'engendre l'étalement urbain pour la société.
                </p>

                <InfoBox variant="warning">
                  <strong>Données synthétiques :</strong> le scénario de comparaison (site de
                  remplacement) est <strong>généré automatiquement</strong> à partir de la
                  superficie du site réel et des données locales (INSEE), en utilisant des
                  générateurs paramétriques. Ce n'est pas un site réel, mais un site représentatif
                  du territoire.
                </InfoBox>

                <div className="rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 p-4 space-y-3">
                  <p className="text-xs font-semibold  uppercase tracking-wide">
                    Si le site est une friche
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg border border-[#C5C7A8] bg-[#F2F3EC] p-3">
                      <p className="font-semibold mb-1  text-grey-dark">Colonne gauche</p>
                      <p className="text-blue-ultradark mb-0">
                        Projet sur <strong>la friche</strong>
                      </p>
                      <p className=" mt-1 text-[#505134] mb-0">
                        + exploitation agricole en activité (statu quo)
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#69426A] bg-[#E4D8E4] p-3">
                      <p className="font-semibold  mb-1  text-grey-dark">
                        Colonne droite - étalement urbain
                      </p>
                      <p className="text-blue-ultradark mb-0">
                        Projet sur <strong>exploitation agricole</strong> fictive
                      </p>
                      <p className="text-[#69426A] mt-1 mb-0">
                        + friche non reconvertie (statu quo)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50  dark:bg-gray-800 border border-gray-200 p-4 space-y-3">
                  <p className="text-xs font-semibold  uppercase tracking-wide">
                    Si le site est un terrain agricole ou naturel
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg border border-[#69426A] bg-[#E4D8E4] p-3">
                      <p className="font-semibold mb-1 text-grey-dark">
                        Colonne gauche - étalement urbain
                      </p>
                      <p className="text-blue-ultradark mb-0">
                        Projet sur <strong>le terrain agricole/naturel </strong>
                      </p>
                      <p className="text-[#69426A] mt-1 mb-0">
                        + friche non reconvertie (statu quo)
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#C5C7A8] bg-[#F2F3EC] p-3">
                      <p className="font-semibold  mb-1  text-grey-dark">Colonne droite</p>
                      <p className="text-blue-ultradark mb-0">
                        Projet sur <strong>friche fictive</strong>
                      </p>
                      <p className=" mt-1 text-[#505134] mb-0">
                        + terrain agricole/naturel en activité (statu quo)
                      </p>
                    </div>
                  </div>
                </div>

                <ImpactGroup className="mt-4 space-y-3 p-4">
                  <span className="font-semibold ">Cas particulier&nbsp;: voirie et réseaux</span>
                  <p className="text-sm  leading-relaxed">
                    Dans cette vue, les dépenses de voirie et réseaux du projet sont remplacées par
                    deux impacts comparatifs plus fins :
                  </p>

                  <ul className=" space-y-2 text-sm ">
                    <ImpactRow
                      label="Économies sur la construction de voirie et réseaux "
                      sign="±"
                      note="construire sur une friche évite de créer une nouvelle desserte ex nihilo"
                    />
                    <ImpactRow
                      label="Économies sur la maintenance annuelle"
                      sign="±"
                      note="les réseaux existants n'ont pas besoin d'être étendus"
                    />
                  </ul>
                  <InfoBox variant="neutral">
                    Ces deux impacts sont positifs si le projet est sur une friche (on évite de
                    créer des réseaux), négatifs si le projet est sur un terrain agricole ou naturel
                    (on doit quand même créer des réseaux, c'est le coût de l'étalement).
                  </InfoBox>
                </ImpactGroup>

                <div className="mt-4">
                  <InfoBox variant="info">
                    <strong>Point d'équilibre dans cette vue :</strong> chaque colonne affiche
                    également l'année à laquelle le coût de l'opération est compensé par les impacts
                    socio-économiques cumulés. Si la colonne « projet sur friche » atteint
                    l'équilibre plus tôt que la colonne « étalement urbain », cela démontre
                    l'avantage économique de la reconversion.
                  </InfoBox>
                </div>
              </div>
            </div>
          </section>

          {displayDevelopmentScore && (
            <section id="amenagescore" className="space-y-4 scroll-mt-20">
              <SectionTitle
                emoji="🏆"
                title="AménageScore"
                subtitle="Une note synthétique de A à E résumant la performance du projet sur 5 critères. Chaque critère a deux états : Succès ou Échec."
              />

              <div className="flex gap-2">
                {(["A", "B", "C", "D", "E"] as const).map((g) => (
                  <ScoreBadge key={g} grade={g} />
                ))}
              </div>
              <InfoBox variant="warning">
                Ce référentiel de notation des projets est <strong>en cours de construction</strong>
                , il s'agit ici d'une première version simple qui est amenée à évoluer
                prochainement.
              </InfoBox>
              <div className="space-y-8">
                <ImpactGroup className="p-4">
                  <h4 className="font-semibold  mb-4">Calcul de la note</h4>
                  <p className="text-sm  mb-4 leading-relaxed">
                    La note est basée sur le <strong>nombre de critères en échec</strong>, en
                    excluant la Macroéconomie (critère 5) qui est déjà reflétée par les critères
                    Environnement et Riverains. Seuls <strong>4 critères</strong> entrent dans le
                    barème.
                  </p>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 pr-4 text-xs font-semibold  uppercase tracking-wide">
                            Critères en échec (sur 4)
                          </th>
                          <th className="text-left py-2 text-xs font-semibold  uppercase tracking-wide">
                            Note
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(
                          [
                            { failures: "0", grade: "A" },
                            { failures: "1", grade: "B" },
                            { failures: "2", grade: "C" },
                            { failures: "3", grade: "D" },
                            { failures: "4", grade: "E" },
                          ] as const
                        ).map(({ failures, grade }) => (
                          <tr
                            key={grade}
                            className={`border-b border-grey-dark last:border-0 bg-grey-light dark:bg-grey-dark`}
                          >
                            <td className="py-2.5 px-4 ">
                              {failures} {failures === "0" || failures === "1" ? "échec" : "échecs"}
                            </td>
                            <td className="py-2.5">
                              <ScoreBadge grade={grade} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ImpactGroup>

                <div className="space-y-3">
                  <CriterionRow
                    emoji="🏛️"
                    title="1. Finances de la collectivité locale"
                    condition="Le total des impacts économiques attribués à la collectivité locale est positif"
                    detail={
                      <ul className="text-sm  list-disc list-inside space-y-1 mt-2">
                        <li>🏛️ Recettes fiscales</li>
                        <li>🏚️ Économies réalisées grâce à la suppression de la friche</li>
                        <li>💰 Bénéfices d'exploitation</li>
                        <li>🔑 Revenus locatifs communaux</li>
                        <li>👷 Moins les dépenses communales (voirie, réseaux)</li>
                      </ul>
                    }
                  />

                  <CriterionRow
                    emoji="💼"
                    title="2. Emploi"
                    condition="La différence nette d'emplois temps plein (ETP) générée par le projet est positive"
                    detail={
                      <p className="text-sm  mt-2">
                        ETP créés (construction + exploitation) moins ETP supprimés (ex. fin
                        d'exploitation agricole).
                      </p>
                    }
                  />

                  <CriterionRow
                    emoji="🏘️"
                    title="3. Qualité de vie des riverains"
                    condition="La somme des impacts indirects pour les riverains et entreprises locales est positive"
                    detail={
                      <div className="space-y-3 mt-2">
                        <div>
                          <p className="text-sm font-medium  mb-1">
                            Impacts comptabilisés pour le succès / l'échec :
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-sm ">
                            <li>Accidents évités grâce aux déplacements évités</li>
                            <li>Valeur monétaire du temps gagné grâce aux déplacements évités</li>
                            <li>
                              Dépenses de réparation évitées grâce aux accidents de la route évités
                            </li>
                            <li>
                              Dépenses de santé évitées grâce à la pollution et aux accidents de la
                              route évités
                            </li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium  mb-1">
                            Blocs de détail affichés dans l'interface :
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-sm ">
                            <li>
                              <strong>🏡 Cadre de vie</strong> : hausse de la valeur patrimoniale si
                              le site de reconversion est une friche
                            </li>
                            <li>
                              <strong>❤️ Santé</strong> : si le projet prévoit de la dépollution ou
                              si l'impact « dépenses de santé évitées » &gt; 0
                            </li>
                            <li>
                              <strong>⏱️ Temps libre</strong> : si la valeur du temps gagné grâce
                              aux déplacements évités &gt; 0
                            </li>
                            <li>
                              <strong>🚦 Sécurité routière</strong> : si les accidents évités sont
                              &gt; 0
                            </li>
                            <li>
                              <strong>⚠️ Sécurité des riverains</strong> : si des accidents
                              s'étaient produit sur la friche (impact « accidents évités » &gt; 0)
                            </li>
                          </ul>
                        </div>
                      </div>
                    }
                  />

                  <CriterionRow
                    emoji="🌿"
                    title="4. Environnement"
                    condition="La somme des impacts monétaires environnementaux indirects est positive"
                    detail={
                      <div className="space-y-2 mt-2">
                        <ul className="list-disc list-inside space-y-1 text-sm ">
                          <li>
                            Émissions CO₂ évitées (climatisation, énergie, trafic, stockage dans les
                            sols)
                          </li>
                          <li>
                            Services écosystémiques (pollinisation, cycle de l'eau, érosion des
                            sols, azote…)
                          </li>
                          <li>
                            Produits forestiers, régulation des espèces invasives, bien-être nature
                          </li>
                          <li>Régulation de l'eau, dépenses de santé liées à la pollution</li>
                        </ul>
                        <ul className="list-none list-inside text-sm">
                          <li>
                            {" "}
                            <InternalLink href="#projet">→ Conservation des sols</InternalLink>
                          </li>
                          <li>
                            <InternalLink href="#methodologie">
                              → Valeur tutélaire du CO₂
                            </InternalLink>
                          </li>
                        </ul>
                      </div>
                    }
                  />

                  <CriterionRow
                    emoji="🌍"
                    title="5. Macroéconomie (hors barème)"
                    condition="La somme des impacts macroéconomiques indirects est positive"
                    detail={
                      <div className="space-y-2 mt-2">
                        <p className="text-sm ">
                          Agrège les impacts bénéficiant à l'humanité dans son ensemble (riverains +
                          environnement). Ce critère n'est <strong>pas pris en compte</strong> dans
                          le calcul de la note afin d'éviter un double comptage.
                        </p>
                        <p className="text-sm">
                          <InternalLink href="#beneficiaires">
                            → Voir les impacts par bénéficiaires
                          </InternalLink>
                        </p>
                      </div>
                    }
                  />
                </div>

                <InfoBox variant="info">
                  <strong>Évolution prévue :</strong> le calcul de la note et le contenu des blocs
                  de détail sont amenés à évoluer. En particulier, le critère Macroéconomie pourrait
                  à terme être dissocié de Riverains + Environnement pour affiner la note.
                </InfoBox>
              </div>
            </section>
          )}

          <section id="methodologie" className="scroll-mt-20">
            <SectionTitle
              emoji="📐"
              title="Note méthodologique : comment compare-t-on des montants dans le temps ?"
            />

            <div className="space-y-4">
              <p className=" leading-relaxed">
                Tous les impacts récurrents (qui se répètent chaque année) sont pondérés lors de
                leur calcul. Quatre facteurs peuvent s'appliquer selon le type d'impact :
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    icon: "📉",
                    label: "Actualisation financière",
                    desc: "Un euro aujourd'hui vaut plus qu'un euro dans 10 ans. On ramène tous les flux futurs à leur valeur d'aujourd'hui.",
                  },
                  {
                    icon: "📈",
                    label: "Évolution du PIB",
                    desc: "Certains coûts et valeurs augmentent avec la richesse produite. On corrige pour refléter cette tendance.",
                  },
                  {
                    icon: "🌡️",
                    label: "Valeur tutélaire du CO₂",
                    desc: "Le prix social d'une tonne de CO₂ augmente dans le temps. Les bénéfices climatiques futurs valent donc plus.",
                  },
                  {
                    icon: "🚘",
                    label: "Émissions CO₂ par véhicule",
                    desc: "Les voitures deviennent progressivement moins polluantes. On tient compte de cette amélioration attendue.",
                  },
                ].map(({ icon, label, desc }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-gray-200 bg-white dark:bg-black p-4 shadow-sm"
                  >
                    <div className="text-lg mb-1">{icon}</div>
                    <p className="font-semibold ">{label}</p>

                    <p className="mt-1 text-sm  leading-relaxed">{desc}</p>
                    <PlaceholderCalc />
                  </div>
                ))}
              </div>

              <InfoBox variant="neutral">
                <strong>Conventions de signe :</strong> dans tous les tableaux, un montant{" "}
                <span className="text-success-ultradark font-semibold">positif (+)</span> représente
                un bénéfice, un revenu ou un coût évité ; un montant{" "}
                <span className="text-error-ultradark font-semibold">négatif (-)</span> représente
                une dépense ou une perte.
              </InfoBox>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
