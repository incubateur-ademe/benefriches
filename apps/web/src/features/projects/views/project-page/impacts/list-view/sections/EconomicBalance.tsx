import { fr } from "@codegouvfr/react-dsfr";

import { EconomicBalance } from "@/features/projects/domain/projectImpactsEconomicBalance";

import {
  getEconomicBalanceDetailsImpactLabel,
  getEconomicBalanceImpactLabel,
} from "../../getImpactLabel";
import ImpactModalDescriptionProviderContainer from "../../impact-description-modals";
import { ImpactModalDescriptionContext } from "../../impact-description-modals/ImpactModalDescriptionContext";
import ImpactActorsItem from "../ImpactActorsItem";
import ImpactSection from "../ImpactSection";

type Props = {
  impact: EconomicBalance;
};

const EconomicBalanceListSection = ({ impact }: Props) => {
  const { total, economicBalance, bearer } = impact;

  return (
    <ImpactModalDescriptionProviderContainer dialogId={`economicBalance_list`}>
      <ImpactModalDescriptionContext.Consumer>
        {({ openImpactModalDescription, dialogId }) => (
          <>
            <button
              aria-hidden="true"
              className={fr.cx("fr-hidden")}
              id={`${dialogId}-controlButton`}
              aria-controls={dialogId}
              data-fr-opened="false"
            ></button>
            <ImpactSection
              title="Bilan de l'opération"
              isMain
              total={total}
              initialShowSectionContent={false}
              onTitleClick={() => {
                document.getElementById(`${dialogId}-controlButton`)?.click();
                openImpactModalDescription({ sectionName: "economic_balance" });
              }}
            >
              {economicBalance.map(({ name, value, details = [] }) => (
                <ImpactActorsItem
                  key={name}
                  label={getEconomicBalanceImpactLabel(name)}
                  onClick={() => {
                    document.getElementById(`${dialogId}-controlButton`)?.click();
                    openImpactModalDescription({
                      sectionName: "economic_balance",
                      impactName: name,
                    });
                  }}
                  actors={[
                    {
                      label: bearer ?? "Aménageur",
                      value,
                      details: details.map(({ name: detailsName, value: detailsValue }) => ({
                        label: getEconomicBalanceDetailsImpactLabel(name, detailsName),
                        value: detailsValue,
                        onClick: () => {
                          document.getElementById(`${dialogId}-controlButton`)?.click();
                          openImpactModalDescription({
                            sectionName: "economic_balance",
                            impactName: name,
                            impactDetailsName: detailsName,
                          });
                        },
                      })),
                    },
                  ]}
                  type="monetary"
                />
              ))}
            </ImpactSection>
          </>
        )}
      </ImpactModalDescriptionContext.Consumer>
    </ImpactModalDescriptionProviderContainer>
  );
};

export default EconomicBalanceListSection;
