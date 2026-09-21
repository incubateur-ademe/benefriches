import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function OnboardingSpeechBubble({ children }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-6">
      <img
        src="/img/onboarding/mintsa.png"
        alt=""
        aria-hidden="true"
        className="size-[60px] shrink-0 rounded-full object-cover"
      />
      <div className="relative w-full rounded-[8px] border border-solid border-border-grey bg-white p-4 dark:bg-dsfr-grey">
        <span
          aria-hidden="true"
          className="absolute -left-[7px] top-6 hidden size-3 rotate-45 border-b border-l border-t-0 border-r-0 border-solid border-border-grey bg-white dark:bg-dsfr-grey md:block"
        />
        {children}
      </div>
    </div>
  );
}
