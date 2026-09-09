import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function OnboardingSpeechBubble({ children }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-6">
      {/* Figma avatar asset (file tgMAVc4oAfXQ3a8NRURmcF, node 28571:16043) could not be fetched
          from this environment: a `figma-remote-mcp` server is registered for this project (see
          `claude mcp list`) but was not attached to this coding session's toolset, and no Figma
          personal access token is available to call the REST image API directly. Placeholder
          initials keep the 60px circle sizing/position correct; swap for the real Mintsa
          illustration once a session with working Figma access (or the exported PNG/SVG asset)
          is available. */}
      <span
        aria-hidden="true"
        className="flex size-[60px] shrink-0 items-center justify-center rounded-full bg-blue-ultralight font-bold dark:bg-blue-ultradark"
      >
        MP
      </span>
      <div className="relative w-full rounded-[8px] border border-solid border-border-grey bg-white p-4 dark:bg-dsfr-grey">
        <span
          aria-hidden="true"
          className="absolute -left-[7px] top-6 hidden size-3 rotate-45 border-b border-l border-solid border-border-grey bg-white dark:bg-dsfr-grey md:block"
        />
        {children}
      </div>
    </div>
  );
}
