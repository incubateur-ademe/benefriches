import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// Placeholder avatar for the onboarding step shell. Real illustration/copy lands in later
// tickets — this component only establishes the layout (avatar stacked above the bubble on
// small screens, side-by-side from `md` up).
export default function OnboardingSpeechBubble({ children }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-8">
      <div
        aria-hidden="true"
        className="flex size-20 shrink-0 items-center justify-center rounded-full bg-blue-ultralight text-4xl dark:bg-blue-ultradark"
      >
        🙂
      </div>
      <div className="relative w-full rounded-2xl bg-background-ultralight p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
