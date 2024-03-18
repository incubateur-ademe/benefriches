import { ReactNode } from "react";
import { ReconversionProjectImpacts } from "../../domain/impacts.types";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/views/components/SurfaceArea/SurfaceArea";

type Props = {
  project: {
    name: string;
  };
  impacts: ReconversionProjectImpacts;
};

type ImpactItemRowProps = {
  children: ReactNode;
};
const ImpactItemRow = ({ children }: ImpactItemRowProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #DDDDDD",
      }}
    >
      {children}
    </div>
  );
};

const ImpactDetailRow = ({ children }: ImpactItemRowProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
};

const FoldableImpactItemRow = ({ children }: ImpactItemRowProps) => {
  return (
    <div
      style={{
        borderBottom: "1px solid #DDDDDD",
      }}
    >
      {children}
    </div>
  );
};

const ImpactLabel = ({ children }: ImpactItemRowProps) => {
  return <div style={{ padding: "0.5rem 0", fontWeight: "700" }}>{children}</div>;
};

const ImpactDetailLabel = ({ children }: ImpactItemRowProps) => {
  return <div style={{ marginLeft: "1rem", padding: "0.5rem 0" }}>{children}</div>;
};

type ImpactValueProps = {
  children: ReactNode;
  isTotal?: boolean;
};
const ImpactValue = ({ children, isTotal = false }: ImpactValueProps) => {
  return (
    <div
      style={{
        padding: "0.5rem",
        width: "200px",
        background: "#ECF5FD",
        textAlign: "center",
        fontWeight: isTotal ? "700" : "normal",
      }}
    >
      {children}
    </div>
  );
};

const formatImpact = (impactValue: number) => {
  const prefix = impactValue > 0 ? "+" : "";
  return prefix + formatNumberFr(roundTo2Digits(impactValue));
};

const ImpactsListView = ({ impacts }: Props) => {
  return (
    <div style={{ maxWidth: "900px", margin: "auto" }}>
      <section className="fr-mb-5w">
        <h3>Impacts économiques</h3>
      </section>
      <section className="fr-mb-5w">
        <h3>Impacts environnementaux</h3>
        {impacts.contaminatedSurfaceArea && (
          <ImpactItemRow>
            <ImpactLabel>✨ Surface polluée</ImpactLabel>
            <ImpactValue isTotal>
              {formatImpact(
                impacts.contaminatedSurfaceArea.forecast - impacts.contaminatedSurfaceArea.base,
              )}{" "}
              {SQUARE_METERS_HTML_SYMBOL}
            </ImpactValue>
          </ImpactItemRow>
        )}
        <FoldableImpactItemRow>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <ImpactLabel>🌧 Surface perméable</ImpactLabel>
            <ImpactValue isTotal>
              {formatImpact(
                impacts.permeableSurfaceArea.forecast - impacts.permeableSurfaceArea.base,
              )}{" "}
              {SQUARE_METERS_HTML_SYMBOL}
            </ImpactValue>
          </div>
          <ImpactDetailRow>
            <ImpactDetailLabel>🪨 Surface perméable minérale</ImpactDetailLabel>
            <ImpactValue>
              {formatImpact(
                impacts.permeableSurfaceArea.mineralSoil.forecast -
                  impacts.permeableSurfaceArea.mineralSoil.base,
              )}{" "}
              {SQUARE_METERS_HTML_SYMBOL}
            </ImpactValue>
          </ImpactDetailRow>
          <ImpactDetailRow>
            <ImpactDetailLabel>🌱 Surface perméable végétalisée</ImpactDetailLabel>
            <ImpactValue>
              {formatImpact(
                impacts.permeableSurfaceArea.greenSoil.forecast -
                  impacts.permeableSurfaceArea.greenSoil.base,
              )}{" "}
              {SQUARE_METERS_HTML_SYMBOL}
            </ImpactValue>
          </ImpactDetailRow>
        </FoldableImpactItemRow>
      </section>
      <section>
        <h3>Impacts sociaux</h3>
        <FoldableImpactItemRow>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <ImpactLabel>🧑‍🔧 Emplois équivalent temps plein mobilisés</ImpactLabel>
            <ImpactValue isTotal>
              {formatImpact(impacts.fullTimeJobs.forecast - impacts.fullTimeJobs.current)}
            </ImpactValue>
          </div>
          <ImpactDetailRow>
            <ImpactDetailLabel>👷 Reconversion du site</ImpactDetailLabel>
            <ImpactValue>
              {formatImpact(
                impacts.fullTimeJobs.conversion.forecast - impacts.fullTimeJobs.conversion.current,
              )}
            </ImpactValue>
          </ImpactDetailRow>
          <ImpactDetailRow>
            <ImpactDetailLabel>🧑‍🔧 Exploitation du site</ImpactDetailLabel>
            <ImpactValue>
              {formatImpact(
                impacts.fullTimeJobs.operations.forecast - impacts.fullTimeJobs.operations.current,
              )}
            </ImpactValue>
          </ImpactDetailRow>
        </FoldableImpactItemRow>
        {impacts.accidents && (
          <FoldableImpactItemRow>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <ImpactLabel>🤕 Accidents évités sur la friche</ImpactLabel>
              <ImpactValue isTotal>{formatImpact(impacts.accidents.current)}</ImpactValue>
            </div>
            <ImpactDetailRow>
              <ImpactDetailLabel>💥 Blessés légers évités</ImpactDetailLabel>
              <ImpactValue>{formatImpact(impacts.accidents.minorInjuries.current)}</ImpactValue>
            </ImpactDetailRow>
            <ImpactDetailRow>
              <ImpactDetailLabel>🚑 Blessés graves évités</ImpactDetailLabel>
              <ImpactValue>{formatImpact(impacts.accidents.severeInjuries.current)}</ImpactValue>
            </ImpactDetailRow>
          </FoldableImpactItemRow>
        )}
        {impacts.householdsPoweredByRenewableEnergy && (
          <ImpactItemRow>
            <ImpactLabel>🏠 Foyers alimentés par les EnR</ImpactLabel>
            <ImpactValue isTotal>
              {formatImpact(impacts.householdsPoweredByRenewableEnergy.forecast)}
            </ImpactValue>
          </ImpactItemRow>
        )}
      </section>
    </div>
  );
};

export default ImpactsListView;
