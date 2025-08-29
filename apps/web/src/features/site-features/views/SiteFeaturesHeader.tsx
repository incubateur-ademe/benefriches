import { fr } from "@codegouvfr/react-dsfr";
import { SiteNature } from "shared";

import classNames from "@/shared/views/clsx";
import Badge from "@/shared/views/components/Badge/Badge";

type Props = {
  siteName: string;
  address: string;
  siteNature: SiteNature;
  isExpressSite: boolean;
};

function getPictogramUrlForSiteNature(siteNature: SiteNature): string {
  switch (siteNature) {
    case "FRICHE":
      return "/img/pictograms/site-nature/friche.svg";
    case "AGRICULTURAL_OPERATION":
      return "/img/pictograms/site-nature/agricultural-operation.svg";
    case "NATURAL_AREA":
      return "/img/pictograms/site-nature/natural-area.svg";
  }
}

export default function SiteFeaturesHeader({
  siteName,
  address,
  siteNature,
  isExpressSite,
}: Props) {
  return (
    <section className={classNames("py-8", "bg-impacts-main", "dark:bg-grey-dark")}>
      <div className={fr.cx("fr-container")}>
        <div className="flex items-center">
          <img
            className="mr-3"
            src={getPictogramUrlForSiteNature(siteNature)}
            aria-hidden={true}
            alt=""
            width={76}
            height={76}
          />
          <div>
            <div className="md:inline-flex md:items-center">
              <h2 className="my-0">{siteName}</h2>
              {isExpressSite && (
                <Badge small className="my-2 md:mx-3" style="blue">
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
