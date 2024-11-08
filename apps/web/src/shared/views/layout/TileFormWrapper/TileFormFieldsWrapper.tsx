import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

type Props = {
  children: ReactNode;
  small?: boolean;
};

function TileFormFieldsWrapper({ children, small = false }: Props) {
  return (
    <div
      className={classNames(
        "tw-grid",
        small
          ? ["tw-grid-cols-[repeat(auto-fill,_350px)]"]
          : ["tw-grid-cols-[repeat(auto-fill,_357px)]", "lg:tw-grid-cols-[repeat(2,_357px)]"],
        "tw-gap-x-4",
        "tw-mb-4",
      )}
    >
      {children}
    </div>
  );
}

export default TileFormFieldsWrapper;
