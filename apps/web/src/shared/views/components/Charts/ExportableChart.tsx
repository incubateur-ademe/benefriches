import Button from "@codegouvfr/react-dsfr/Button";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import * as Highcharts from "highcharts";
import HighchartsReact, { HighchartsReactProps } from "highcharts-react-official";
import { Fragment, useRef } from "react";

import useExportConfig, { ExportingOptionsProps } from "../../charts/useExportConfig";
import classNames from "../../clsx";
import { MENU_ITEMS_CLASSES } from "../Menu/classes";
import ExportChartMenuItems from "./ExportChartMenuItems";

type Props = {
  ref?: React.RefObject<HighchartsReact.RefObject | null>;
  exportingOptions: ExportingOptionsProps;
} & HighchartsReactProps;

const ExportableChart = ({ ref, exportingOptions, options, ...props }: Props) => {
  const innerRef = useRef<HighchartsReact.RefObject>(null);
  const chartRef = ref === undefined ? innerRef : ref;

  const exportConfig = useExportConfig(exportingOptions);

  return (
    <div className="flex flex-col">
      <Menu>
        <MenuButton as={Fragment}>
          <Button
            title="Menu"
            priority="tertiary no outline"
            iconId="ri-download-2-line"
            onClick={(event) => {
              event.stopPropagation();
            }}
            className="text-text-light self-end"
          />
        </MenuButton>
        <MenuItems
          anchor="bottom end"
          transition
          className={classNames(
            "z-[2000]", // pour s'afficher correctement dans une Dialog (z-index 1750)
            MENU_ITEMS_CLASSES,
          )}
        >
          <ExportChartMenuItems
            chartRef={chartRef}
            exportConfig={exportConfig}
            colors={exportingOptions.colors}
            colorBySeries={exportingOptions.colorBySeries}
          />
        </MenuItems>
        <HighchartsReact
          highcharts={Highcharts}
          ref={chartRef}
          options={{ ...options, exporting: exportConfig }}
          {...props}
        />
      </Menu>
    </div>
  );
};

export default ExportableChart;
