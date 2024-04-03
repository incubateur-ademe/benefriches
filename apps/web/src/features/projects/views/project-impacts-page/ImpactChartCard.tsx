import { ReactNode } from "react";

type Props = {
  title: ReactNode;
  children?: ReactNode;
  onTitleClick?: () => void;
};

const ImpactCard = ({ title, children, onTitleClick }: Props) => {
  return (
    <figure
      style={{
        border: "1px solid #DDDDDD",
        background: "#ECF5FD",
        height: "100%",
      }}
      className="tw-flex tw-flex-col fr-py-2w fr-px-3w fr-m-0"
    >
      {onTitleClick ? (
        <strong className="tw-cursor-pointer" onClick={onTitleClick}>
          {title}
        </strong>
      ) : (
        <strong>{title}</strong>
      )}

      <div className="tw-flex tw-flex-col tw-grow tw-justify-center">{children}</div>
    </figure>
  );
};

export default ImpactCard;
