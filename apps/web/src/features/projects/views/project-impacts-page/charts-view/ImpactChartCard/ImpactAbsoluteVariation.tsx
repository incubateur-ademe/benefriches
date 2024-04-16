import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";

import classNames from "@/shared/views/clsx";

type Props = {
  children: ReactNode;
};

export default function ImpactAbsoluteVariation({ children }: Props) {
  return (
    <div className={classNames(fr.cx("fr-text--sm", "fr-m-0"), "tw-text-center")}>{children}</div>
  );
}
