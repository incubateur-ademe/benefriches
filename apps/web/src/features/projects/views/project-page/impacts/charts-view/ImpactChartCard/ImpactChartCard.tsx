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
        "tw-relative tw-mb-8",
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
        containerProps?.className,
      )}
      onClick={() => {
        buttonControlsDialogRef.current?.click();
      }}
    >
      <div className="tw-flex tw-justify-between tw-mb-2">
        <div className="tw-flex tw-flex-col tw-justify-center">
          <h3
            className={classNames("tw-text-2xl", subtitle ? "tw-mb-2" : "tw-mb-0", classes?.title)}
          >
            {title}
          </h3>
          {subtitle && <h4 className="tw-text-sm tw-font-normal tw-mb-2">{subtitle}</h4>}
        </div>

        <div className="tw-flex">
          <Button
            title="Menu"
            priority="tertiary no outline"
            iconId="fr-icon-information-line"
            className="tw-text-text-light"
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
                className="tw-text-text-light"
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
