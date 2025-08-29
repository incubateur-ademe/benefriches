import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

type Props = {
  children: ReactNode;
  tileCount: number;
};

function TileFormFooterWrapper({ children, tileCount }: Props) {
  return (
    <div
      className={classNames("col-start-1", "col-end-[-1]", "mt-6")}
      style={{ gridRowStart: tileCount + 1 }}
    >
      {children}
    </div>
  );
}

export default TileFormFooterWrapper;
