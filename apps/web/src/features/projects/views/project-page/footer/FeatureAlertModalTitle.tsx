import { FrCxArg } from "@codegouvfr/react-dsfr";

import classNames from "@/shared/views/clsx";
import Badge from "@/shared/views/components/Badge/Badge";

type Props = {
  title?: string;
  iconId?: FrCxArg;
};

function FeatureAlertModalTitle({ title, iconId }: Props) {
  return (
    <div className="text-dsfr-title-blue">
      {iconId && <i className={classNames("fr-icon--xl pr-2", iconId)}></i>}
      {title}
      <Badge small style="green-tilleul" className="ml-2">
        Bientôt disponible
      </Badge>
    </div>
  );
}

export default FeatureAlertModalTitle;
