import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

type Props = {
  children: ReactNode;
  tileCount: number;
};

function TileFormFooterWrapper({ children, tileCount }: Props) {
  return (
    <div
      className={classNames("tw-col-start-1", "tw-col-end-[-1]", "tw-mt-6")}
      style={{ gridRowStart: tileCount + 1 }}
    >
      {children}
    </div>
  );
}

export default TileFormFooterWrapper;
