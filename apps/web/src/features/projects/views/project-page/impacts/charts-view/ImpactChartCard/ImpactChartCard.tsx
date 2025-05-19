import Button from "@codegouvfr/react-dsfr/Button";
import { Menu, MenuButton, MenuItems, MenuSeparator } from "@headlessui/react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Fragment, useRef } from "react";

import useExportConfig, { ExportingOptionsProps } from "@/shared/views/charts/useExportConfig";
import classNames, { ClassValue } from "@/shared/views/clsx";
import ExportChartMenuItems from "@/shared/views/components/Charts/ExportChartMenuItems";
import MenuItemButton from "@/shared/views/components/Menu/MenuItemButton";
import { MENU_ITEMS_CLASSES } from "@/shared/views/components/Menu/classes";

import "./ImpactChartCard.css";

type ChartCardProps = {
  options: HighchartsReact.Props["options"];
  dialogId: string;
  containerProps?: {
    className?: ClassValue;
    id?: string;
  };
  exportingOptions?: ExportingOptionsProps;
};

const ImpactChartCard = ({
  options,
  dialogId,
  containerProps,
  exportingOptions,
}: ChartCardProps) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const exportConfig = useExportConfig({
    title: options?.title?.text,
    subtitle: options?.subtitle?.text,
    ...exportingOptions,
  });

  return (
    <div className="tw-relative tw-mb-8">
      <div>
        <div className="tw-absolute tw-right-6 tw-top-6 tw-z-10">
          <Menu>
            <MenuButton as={Fragment}>
              <Button
                title="Menu"
                priority="tertiary no outline"
                iconId="fr-icon-more-fill"
                className="tw-text-text-light"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              />
            </MenuButton>
            <MenuItems anchor="bottom end" transition className={classNames(MENU_ITEMS_CLASSES)}>
              <MenuItemButton
                iconId="ri-table-line"
                aria-controls={dialogId}
                data-fr-opened="false"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                En savoir plus sur cet indicateur
              </MenuItemButton>
              <MenuSeparator className="tw-m-2 tw-h-px tw-bg-borderGrey" />
              <ExportChartMenuItems
                chartRef={chartRef}
                exportConfig={exportConfig}
                colors={exportingOptions?.colors}
                colorBySeries={exportingOptions?.colorBySeries}
              />
            </MenuItems>
          </Menu>
        </div>
      </div>
      <div className="tw-flex tw-flex-col tw-grow tw-justify-between">
        <HighchartsReact
          highcharts={Highcharts}
          ref={chartRef}
          containerProps={{
            id: containerProps?.id,
            "aria-controls": dialogId,
            "data-fr-opened": "false",
            className: classNames(
              "tw-p-6",
              "tw-m-0",
              "tw-rounded-2xl",
              "tw-flex",
              "tw-flex-col",
              "tw-justify-between",
              "tw-bg-white",
              "dark:tw-bg-black",
              "tw-border",
              "tw-border-solid",
              "tw-border-transparent",
              "tw-cursor-pointer",
              "hover:tw-border-current focus:tw-border-current",
              "tw-transition tw-ease-in-out tw-duration-500",
              "impacts-chart-card",
              containerProps?.className,
            ),
          }}
          options={{ ...options, exporting: exportConfig }}
        />
      </div>
    </div>
  );
};

export default ImpactChartCard;
