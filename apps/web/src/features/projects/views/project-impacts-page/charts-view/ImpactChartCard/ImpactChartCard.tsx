import { ReactNode } from "react";

type Props = {
  title: ReactNode;
  children?: ReactNode;
  onTitleClick?: () => void;
};

const ImpactChartCard = ({ title, children, onTitleClick }: Props) => {
  const titleClassName = `fr-text--sm ${onTitleClick ? "tw-cursor-pointer hover:tw-underline" : ""}`;
  return (
    <figure
      style={{
        border: "1px solid #DDDDDD",
        background: "#ECF5FD",
        height: "100%",
      }}
      className="tw-flex tw-flex-col fr-py-2w fr-px-3w fr-m-0"
    >
      <strong className={titleClassName} onClick={onTitleClick}>
        {title}
      </strong>
      <div className="tw-flex tw-flex-col tw-grow tw-justify-center">{children}</div>
    </figure>
  );
};

export default ImpactChartCard;
