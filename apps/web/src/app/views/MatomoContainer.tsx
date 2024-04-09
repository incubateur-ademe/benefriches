import { useEffect } from "react";

type Props = {
  siteId: string;
  matomoUrl: string;
};

export default function MatomoContainer({ siteId, matomoUrl }: Props) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const _paq: any[] = ((window as any)._paq = (window as any)._paq || []);
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(["enableLinkTracking"]);
    (function () {
      _paq.push(["setTrackerUrl", matomoUrl + "matomo.php"]);
      _paq.push(["setSiteId", siteId]);
      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.src = matomoUrl + "matomo.js";

      const headElement = document.getElementsByTagName("head")[0];
      if (headElement) {
        headElement.appendChild(script);
      }
    })();
  }, [siteId, matomoUrl]);

  return null;
}
