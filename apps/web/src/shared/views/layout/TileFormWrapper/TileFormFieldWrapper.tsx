import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function TileFormFieldWrapper({ children }: Props) {
  return <div className="tw-mb-4">{children}</div>;
}

export default TileFormFieldWrapper;
