import {
  getEconomicBalanceDetailsImpactLabel,
  getEconomicBalanceImpactLabel,
} from "../../getImpactLabel";
import ImpactActorsItem from "../ImpactActorsItem";
import ImpactMainTitle from "../ImpactMainTitle";
import ImpactRowValue from "../ImpactRowValue";

import {
  EconomicBalance,
  EconomicBalanceName,
} from "@/features/projects/application/projectImpactsEconomicBalance.selectors";
import { ImpactDescriptionModalCategory } from "@/features/projects/views/project-page/impacts/modals/ImpactDescriptionModalWizard";
import classNames from "@/shared/views/clsx";

const getImpactItemOnClick = (
  itemName: EconomicBalanceName,
  openImpactDescriptionModal: Props["openImpactDescriptionModal"],
) => {
  switch (itemName) {
    case "site_purchase":
      return () => {
        openImpactDescriptionModal("economic-balance.real-estate-acquisition");
      };
    default:
      return undefined;
  }
};

type Props = {
  impact: EconomicBalance;
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const EconomicBalanceListSection = ({ impact, openImpactDescriptionModal }: Props) => {
  const { total, economicBalance, bearer } = impact;
  return (
    <section className="fr-mb-5w">
      <ImpactMainTitle
        title="Bilan de l'opération"
        onClick={() => {
          openImpactDescriptionModal("economic-balance");
        }}
      />
      {economicBalance.map(({ name, value, details = [] }) => (
        <ImpactActorsItem
          key={name}
          label={getEconomicBalanceImpactLabel(name)}
          onClick={getImpactItemOnClick(name, openImpactDescriptionModal)}
          actors={[
            {
              label: bearer ?? "Aménageur",
              value,
              details: details.map(({ name: detailsName, value: detailsValue }) => ({
                label: getEconomicBalanceDetailsImpactLabel(name, detailsName),
                value: detailsValue,
                onClick: getImpactItemOnClick(detailsName, openImpactDescriptionModal),
              })),
            },
          ]}
          type="monetary"
        />
      ))}

      <div className="tw-my-4">
        <ImpactRowValue value={total} type="monetary" isDark>
          <span
            className={classNames(
              "tw-font-bold",
              "tw-text-lg",
              "tw-py-2",
              "tw-px-4",
              "tw-w-full",
              "tw-bg-impacts-main",
              "dark:tw-bg-grey-dark",
              "tw-uppercase",
            )}
          >
            📉 Total du bilan de l’opération
          </span>
        </ImpactRowValue>
      </div>
    </section>
  );
};

export default EconomicBalanceListSection;
