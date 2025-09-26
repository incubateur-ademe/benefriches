import Button from "@codegouvfr/react-dsfr/Button";
import { SiteNature } from "shared";

import classNames from "@/shared/views/clsx";

type Props = {
  onSelectOption: (comparisonSiteNature: SiteNature) => void;
  siteNature: SiteNature;
};

function NonFricheComparisonSectionCard({ onSelectOption, siteNature }: Props) {
  return (
    <section className="flex rounded-lg gap-6 px-6 py-10 mt-10 bg-white dark:bg-black border border-solid border-border-grey">
      <img
        src="/img/pictograms/site-nature/friche.svg"
        width="80"
        height="80"
        aria-hidden="true"
        alt=""
        className={classNames("mb-2", "w-40 h-40")}
      />
      <div>
        <h3>Et si vous réalisiez ce projet sur une friche ?</h3>
        <h4 className={classNames("flex items-center gap-4", "text-xl", "font-bold")}>
          Ce projet sur une friche, c’est :
        </h4>
        {siteNature === "AGRICULTURAL_OPERATION" ? (
          <ul className="text-base list-none p-0 m-0">
            <li className="pb-4">✅ Des emplois agricoles préservés</li>
            <li className="pb-4">✅ Des sols qui absorberaient plus d’eau et plus de carbone</li>
            <li className="pb-4">✅ Des dépenses de construction et de VRD moindres</li>
            <li className="pb-4">Et pleins d’autres impacts.</li>
          </ul>
        ) : (
          <ul className="text-base list-none p-0 m-0">
            <li className="pb-4">✅ Des sols qui absorberaient plus d’eau et plus de carbone</li>
            <li className="pb-4">✅ Des dépenses de construction et de VRD moindres</li>
            <li className="pb-4">
              ✅ Un cadre de vie autour de la friche plus agréable pour les riverains
            </li>
            <li className="pb-4">Et pleins d’autres impacts.</li>
          </ul>
        )}

        <Button
          priority="primary"
          onClick={() => {
            onSelectOption("FRICHE");
          }}
        >
          Comparer
        </Button>
      </div>
    </section>
  );
}

export default NonFricheComparisonSectionCard;
