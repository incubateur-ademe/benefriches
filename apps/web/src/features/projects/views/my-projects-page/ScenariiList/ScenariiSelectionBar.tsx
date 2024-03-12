import { fr } from "@codegouvfr/react-dsfr";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { routes } from "@/app/views/router";

type Props = {
  baseScenario?: {
    type: "PROJECT" | "STATU_QUO";
    id: string;
    name: string;
    siteName: string;
  };
  withScenario?: {
    id: string;
    name: string;
    siteName: string;
  };
  onCancel: () => void;
};

function ScenarioSelection({ name, siteName }: { name?: string; siteName?: string }) {
  if (name && siteName) {
    return (
      <div>
        <span>{name} </span>
        <div className="fr-m-0">
          <span className={fr.cx("fr-icon-map-pin-2-line", "fr-pr-1w")} aria-hidden="true"></span>
          {siteName}
        </div>
      </div>
    );
  }
  return <span>Sélectionnez un scénario</span>;
}

const getCompareButtonProps = (
  baseScenario: Props["baseScenario"],
  withScenario: Props["withScenario"],
) => {
  if (!baseScenario || !withScenario) {
    return {
      disabled: true,
    };
  }
  if (baseScenario.type === "STATU_QUO") {
    const { link } = routes.compareProjects({
      baseProjectId: withScenario.id,
      avecProjet: "STATU_QUO",
    });
    return {
      linkProps: link,
    };
  }
  const { link } = routes.compareProjects({
    baseProjectId: baseScenario.id,
    avecProjet: withScenario.id,
  });
  return {
    linkProps: link,
  };
};

function ScenariiSelectionBar({ baseScenario, withScenario, onCancel }: Props) {
  return (
    <div
      className="fr-py-5v"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 2,
        backgroundColor: "var(--background-open-blue-france",
      }}
    >
      <div
        className={fr.cx("fr-grid-row", "fr-container")}
        style={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          className="fr-grid-row"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <ScenarioSelection name={baseScenario?.name} siteName={baseScenario?.siteName} />
          <span className={fr.cx("fr-px-4w", "fr-text--xl", "fr-mb-0", "fr-text--heavy")}>/</span>
          <ScenarioSelection name={withScenario?.name} siteName={withScenario?.siteName} />
        </div>

        <ButtonsGroup
          inlineLayoutWhen="always"
          alignment="center"
          buttons={[
            {
              priority: "primary",
              children: "Comparer les impacts",
              className: "fr-mb-0",
              ...getCompareButtonProps(baseScenario, withScenario),
            },
            {
              priority: "tertiary",
              children: "Annuler",
              className: "fr-mb-0",
              iconId: "fr-icon-close-line",
              onClick: onCancel,
            },
          ]}
        />
      </div>
    </div>
  );
}

export default ScenariiSelectionBar;
