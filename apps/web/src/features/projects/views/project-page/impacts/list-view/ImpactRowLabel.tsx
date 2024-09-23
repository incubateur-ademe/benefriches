import { ReactNode, useState } from "react";

import classNames from "@/shared/views/clsx";

type Props = {
  children: ReactNode;
  isTotal?: boolean;
  onLabelClick?: () => void;
};

const ImpactRowLabel = ({ children, isTotal = false, onLabelClick }: Props) => {
  const [shouldDisplayLearnMoreButton, setShouldDisplayLearnMoreButton] = useState(false);

  return (
    <div
      className={classNames("tw-inline-flex", onLabelClick && "tw-cursor-pointer")}
      onClick={onLabelClick}
      onMouseEnter={() => {
        setShouldDisplayLearnMoreButton(true);
      }}
      onMouseLeave={() => {
        setShouldDisplayLearnMoreButton(false);
      }}
    >
      {/* text-pretty allows nice text wrapping in case of long labels */}
      <span className={classNames("tw-text-pretty", isTotal && "tw-font-bold")}>{children}</span>
      {onLabelClick && (
        <span>
          <a
            href="#"
            onClick={onLabelClick}
            className={classNames(
              "tw-ml-4 tw-transition-opacity tw-ease-in tw-delay-300 tw-duration-50",
              shouldDisplayLearnMoreButton
                ? "tw-opacity-100"
                : "tw-opacity-0 tw-duration-0 tw-delay-0",
            )}
          >
            En savoir plus
          </a>
        </span>
      )}
    </div>
  );
};

export default ImpactRowLabel;
