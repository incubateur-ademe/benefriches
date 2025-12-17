import Button from "@codegouvfr/react-dsfr/Button";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Fragment, useRef } from "react";

import useExportConfig, { ExportingOptionsProps } from "@/shared/views/charts/useExportConfig";
import classNames, { ClassValue } from "@/shared/views/clsx";
import ExportChartMenuItems from "@/shared/views/components/Charts/ExportChartMenuItems";
import { MENU_ITEMS_CLASSES } from "@/shared/views/components/Menu/classes";

type ChartCardProps = {
  title: string;
  subtitle?: string;
  options: HighchartsReact.Props["options"];
  dialogId: string;
  containerProps?: {
    className?: ClassValue;
    id?: string;
  };
  exportingOptions?: ExportingOptionsProps;
  classes?: { title?: ClassValue };
};

const ImpactChartCard = ({
  title,
  subtitle,
  options,
  dialogId,
  containerProps,
  exportingOptions,
  classes,
}: ChartCardProps) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const buttonControlsDialogRef = useRef<HTMLButtonElement>(null);

  const exportConfig = useExportConfig({
    title,
    subtitle,
    ...exportingOptions,
  });

  return (
    <div
      className={classNames(
        "relative",
        "p-6",
        "rounded-2xl",
        "flex",
        "flex-col",
        "justify-between",
        "bg-white",
        "dark:bg-black",
        "border",
        "border-solid",
        "border-border-grey",
        "cursor-pointer",
        "hover:border-current focus:border-current",
        "transition ease-in-out duration-500",
        containerProps?.className,
      )}
      onClick={() => {
        buttonControlsDialogRef.current?.click();
      }}
    >
      <div className="flex justify-between mb-2">
        <div className="flex flex-col justify-center">
          <h3 className={classNames("text-2xl", subtitle ? "mb-2" : "mb-0", classes?.title)}>
            {title}
          </h3>
          {subtitle && <h4 className="text-sm font-normal mb-2">{subtitle}</h4>}
        </div>

        <div className="flex">
          <Button
            title="Menu"
            priority="tertiary no outline"
            iconId="fr-icon-information-line"
            className="text-text-light"
            aria-controls={dialogId}
            data-fr-opened="false"
            ref={buttonControlsDialogRef}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          <Menu>
            <MenuButton as={Fragment}>
              <Button
                title="Menu"
                priority="tertiary no outline"
                iconId="ri-download-2-line"
                className="text-text-light"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              />
            </MenuButton>
            <MenuItems anchor="bottom end" transition className={classNames(MENU_ITEMS_CLASSES)}>
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
      <HighchartsReact
        highcharts={Highcharts}
        ref={chartRef}
        containerProps={{
          id: containerProps?.id,
        }}
        options={{ ...options, exporting: exportConfig }}
      />
    </div>
  );
};

export default ImpactChartCard;
