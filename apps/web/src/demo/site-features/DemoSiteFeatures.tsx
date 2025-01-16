import { fr } from "@codegouvfr/react-dsfr";

import { SiteFeatures } from "@/features/site-features/core/siteFeatures";
import SiteFeaturesHeader from "@/features/site-features/views/SiteFeaturesHeader";
import SiteFeaturesList from "@/features/site-features/views/SiteFeaturesList";
import classNames from "@/shared/views/clsx";

type Props = {
  siteData: SiteFeatures;
};

function DemoSiteFeatures({ siteData }: Props) {
  return (
    <>
      <SiteFeaturesHeader
        siteName={siteData.name}
        isExpressSite={siteData.isExpressSite}
        address={siteData.address}
        isFriche={siteData.isFriche}
      />
      <section className={classNames(fr.cx("fr-container"), "lg:tw-px-24", "tw-py-6")}>
        <SiteFeaturesList {...siteData} />
      </section>
    </>
  );
}

export default DemoSiteFeatures;
