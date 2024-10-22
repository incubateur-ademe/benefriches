import { fr } from "@codegouvfr/react-dsfr";

import classNames from "@/shared/views/clsx";
import Badge from "@/shared/views/components/Badge/Badge";

type Props = {
  siteName: string;
  address: string;
  isFriche: boolean;
  isExpressSite: boolean;
};

export default function SiteFeaturesHeader({ siteName, address, isFriche, isExpressSite }: Props) {
  return (
    <section className={classNames("tw-py-8", "tw-bg-impacts-main", "dark:tw-bg-grey-dark")}>
      <div className={fr.cx("fr-container")}>
        <div className="tw-flex tw-items-center">
          <img
            className="tw-mr-3"
            src={isFriche ? "/icons/friche.svg" : "/icons/agricole.svg"}
            aria-hidden={true}
            alt="Icône friche"
            width={76}
            height={76}
          />
          <div>
            <div className="tw-inline-flex tw-items-center">
              <h2 className="tw-my-0">{siteName}</h2>
              {isExpressSite && (
                <Badge small className="tw-ml-3" style="green-tilleul">
                  Site express
                </Badge>
              )}
            </div>

            <div>
              <span
                className={fr.cx("fr-icon-map-pin-2-line", "fr-icon--sm", "fr-mr-0-5v")}
                aria-hidden="true"
              />
              <span className={fr.cx("fr-text--lg")}>{address}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
