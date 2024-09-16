import { useId } from "react";

type Props = {
  children: React.ReactNode;
  tooltipText?: string;
};

const WithTooltip = ({ children, tooltipText }: Props) => {
  const id = useId();

  if (!tooltipText) return children;

  const tooltipId = `tooltip-scenario-tile-${id}`;
  return (
    <>
      <div aria-describedby={tooltipId}>{children}</div>
      <span className="fr-tooltip fr-placement" id={tooltipId} role="tooltip" aria-hidden="true">
        {tooltipText}
      </span>
    </>
  );
};

export default WithTooltip;
