import { fr } from "@codegouvfr/react-dsfr";

import classNames from "@/shared/views/clsx";

type Props = {
  children: string;
};

const ScenarioTileTitle = ({ children }: Props) => {
  return (
    <h3 className={classNames(fr.cx("fr-tile__title"), "before:content-none", "text-lg")}>
      {children}
    </h3>
  );
};
export default ScenarioTileTitle;
