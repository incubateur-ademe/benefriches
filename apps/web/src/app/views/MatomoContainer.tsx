import { useEffect } from "react";

type Props = {
  containerUrl: string;
};

export default function MatomoContainer({ containerUrl }: Props) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const _mtm: any[] = ((window as any)._mtm = (window as any)._mtm || []);
    _mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = containerUrl;
    const headElement = document.getElementsByTagName("head")[0];
    if (headElement) {
      headElement.appendChild(script);
    }
  }, [containerUrl]);

  return null;
}
