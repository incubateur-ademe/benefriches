import { fr } from "@codegouvfr/react-dsfr";

import { formatMoney } from "@/shared/core/format-number/formatNumber";
import classNames from "@/shared/views/clsx";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

const data = [
  {
    category: "Coaching",
    S1_2023: 20808,
    S2_2023: 20380,
    S1_2024: 25805,
    S2_2024: 25805,
  },
  { category: "Dev", S1_2023: 0, S2_2023: 99435.24, S1_2024: 96900, S2_2024: 120175 },
  { category: "UX", S1_2023: 38122.56, S2_2023: 42240, S1_2024: 36300, S2_2024: 0 },
  { category: "Bizdev", S1_2023: 0, S2_2023: 0, S1_2024: 18150, S2_2024: 59950 },
  { category: "Total", S1_2023: 58930.56, S2_2023: 162055.24, S1_2024: 177155, S2_2024: 205930 },
];

const formatBudget = (value: number) => {
  return value ? formatMoney(value) : "-";
};

const columns = ["", "S1 2023", "S2 2023", "S1 2024", "S2 2024"];

function BudgetPage() {
  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <h1>Budget</h1>
      <p>
        <strong>Bénéfriches</strong> est un service public numérique, c'est pourquoi nous sommes
        transparents sur les ressources allouées et la manière dont elles sont employées.
      </p>
      <section>
        <h2>Principes</h2>
        <p>
          Nous suivons le{" "}
          <ExternalLink href="https://beta.gouv.fr/approche/manifeste">
            manifeste beta.gouv
          </ExternalLink>{" "}
          dont nous rappelons les principes ici&nbsp;:
        </p>
        <blockquote className="tw-italic">
          <ul>
            <li>
              Les besoins des utilisateurs sont prioritaires sur les besoins de l'administration
            </li>
            <li>Le mode de gestion de l'équipe repose sur la confiance</li>
            <li>L'équipe adopte une approche itérative et d'amélioration en continu</li>
          </ul>
        </blockquote>
      </section>
      <section>
        <h2>Fonctionnement</h2>
        <p>
          Bénéfriches est une start-up d'état : l'équipe est donc portée par un intrapreneur qui est
          responsable du service numérique développé au sein de son administration (l'ADEME en
          l'occurence).
        </p>
        <p>
          Son rôle est multiple : déploiement, gestion des produits, référent auprès de son
          administration (budget, compte rendus d'avancement).
        </p>
        <p>
          Le budget exposé ici ne prend pas en compte l'intrapreneur puisque qu'il est salarié de
          l'ADEME mais concerne les membres de l'équipe.
        </p>
      </section>
      <section>
        <h2>Budget consommé</h2>
        <table className="tw-table-auto tw-border-collapse">
          <thead>
            <tr className="tw-bg-blue-100">
              {columns.map((col, index) => (
                <th key={index} className="tw-px-6 tw-py-3 tw-font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.category}
                className={classNames(row.category === "Total" ? "tw-font-bold" : "")}
              >
                <td
                  className={`tw-px-6 tw-py-3 ${row.category === "Total" ? "tw-font-bold" : "tw-font-medium"}`}
                >
                  {row.category}
                </td>
                <td className="tw-text-right tw-px-6 tw-py-3">{formatBudget(row.S1_2023)}</td>
                <td className="tw-text-right tw-px-6 tw-py-3">{formatBudget(row.S2_2023)}</td>
                <td className="tw-text-right tw-px-6 tw-py-3">{formatBudget(row.S1_2024)}</td>
                <td className="tw-text-right tw-px-6 tw-py-3">{formatBudget(row.S2_2024)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}

export default BudgetPage;
