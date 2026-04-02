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
        "grid",
        small
          ? ["grid-cols-[repeat(auto-fill,300px)]", "sm:grid-cols-[repeat(auto-fill,350px)]"]
          : [
              "grid-cols-[repeat(auto-fill,300px)]",
              "sm:grid-cols-[repeat(auto-fill,357px)]",
              "lg:max-w-[774px]", // 2 par lignes maximum
            ],
        "gap-x-4",
        "mb-4",
      )}
    >
      {children}
    </div>
  );
}

export default TileFormFieldsWrapper;
