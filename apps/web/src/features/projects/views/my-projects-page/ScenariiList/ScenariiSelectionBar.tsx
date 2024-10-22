import { fr } from "@codegouvfr/react-dsfr";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import clsx from "clsx/lite";

import classNames from "@/shared/views/clsx";

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
        <div className="tw-m-0">
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
  // if (baseScenario.type === "STATU_QUO") {
  // const { link } = routes.compareProjects({
  //   baseProjectId: withScenario.id,
  //   avecProjet: "STATU_QUO",
  // });
  // return {
  //   linkProps: link,
  // };
  // }
  // const { link } = routes.compareProjects({
  //   baseProjectId: baseScenario.id,
  //   avecProjet: withScenario.id,
  // });
  // return {
  //   linkProps: link,
  // };
};

function ScenariiSelectionBar({ baseScenario, withScenario, onCancel }: Props) {
  return (
    <div
      className={classNames(
        "tw-fixed",
        "tw-bottom-0",
        "tw-left-0",
        "tw-w-full",
        "tw-z-10",
        "tw-bg-dsfr-openBlue",
        "tw-py-5",
      )}
    >
      <div
        className={classNames(
          fr.cx("fr-grid-row", "fr-container"),
          "tw-justify-between",
          "tw-items-center",
        )}
      >
        <div className={clsx(fr.cx("fr-grid-row"), "tw-justify-between", "tw-items-center")}>
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
              className: "tw-mb-0",
              ...getCompareButtonProps(baseScenario, withScenario),
            },
            {
              priority: "tertiary",
              children: "Annuler",
              className: "tw-mb-0",
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
