import { fr, FrCxArg } from "@codegouvfr/react-dsfr";

import classNames from "@/shared/views/clsx";
import Badge from "@/shared/views/components/Badge/Badge";

type Props = {
  title?: string;
  iconId: FrCxArg;
  isSuccess: boolean;
};

function FeatureAlertModalTitle({ title, iconId, isSuccess }: Props) {
  return (
    <div
      className={classNames(
        isSuccess ? "tw-text-impacts-positive-border" : "tw-text-dsfr-titleBlue",
      )}
    >
      <i
        className={classNames(
          "fr-icon--xl",
          fr.cx(isSuccess ? "fr-icon-success-fill" : iconId),
          "tw-pr-2",
        )}
      ></i>
      {!isSuccess && (
        <>
          {title}
          <Badge small style="green-tilleul" className="tw-ml-2">
            Bientôt disponible
          </Badge>
        </>
      )}
    </div>
  );
}

export default FeatureAlertModalTitle;
