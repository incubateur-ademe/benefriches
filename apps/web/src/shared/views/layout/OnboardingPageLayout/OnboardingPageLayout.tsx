import { ReactNode } from "react";

import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import StickyBottomBar from "@/shared/views/components/StickyBottomBar/StickyBottomBar";
import { useHeaderHeight } from "@/shared/views/hooks/useHeaderHeight";

type Props = {
  htmlTitle: string;
  bottomBarContent: ReactNode;
  children: ReactNode;
};

export default function OnboardingPageLayout({ htmlTitle, bottomBarContent, children }: Props) {
  const headerHeight = useHeaderHeight();
  const containerHeight = headerHeight > 0 ? `calc(100vh - ${headerHeight}px)` : "100vh";

  return (
    <>
      <HtmlTitle>{htmlTitle}</HtmlTitle>
      <div className="flex flex-col" style={{ minHeight: containerHeight }}>
        <section className="fr-container py-10 md:py-20 flex-1">{children}</section>

        <StickyBottomBar>{bottomBarContent}</StickyBottomBar>
      </div>
    </>
  );
}
