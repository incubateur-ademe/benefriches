import { ReactNode } from "react";

type Props = {
  title: ReactNode;
  onClick: () => void;
};

const ImpactMainTitle = ({ title, onClick }: Props) => {
  return (
    <h3 className="tw-cursor-pointer" onClick={onClick}>
      {title}
    </h3>
  );
};

export default ImpactMainTitle;