import { ReactNode } from "react";
import "./Example.css";

import classNames from "@/shared/views/clsx";

function RoundedIcon({ children, ariaLabel }: { children: ReactNode; ariaLabel: string }) {
  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className="tw-mr-4 tw-text-2xl tw-bg-[#D9D9D9] tw-rounded-full tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center"
    >
      {children}
    </span>
  );
}

function ExampleFigure({ children }: { children: ReactNode }) {
  return (
    <figure className="tw-flex tw-items-center tw-w-full tw-border tw-border-solid tw-border-borderGrey tw-p-4 tw-m-0 tw-bg-grey-light tw-rounded-lg">
      {children}
    </figure>
  );
}

function ExampleName({ children }: { children: ReactNode }) {
  return (
    <figcaption>
      <h3 className="tw-text-lg tw-mb-0">{children}</h3>
    </figcaption>
  );
}

type Props = {
  name: string;
  emoji: string;
  text: string;
  arrowDirection?: "left" | "right";
  className?: string;
};

export default function ExampleArticle({
  name,
  emoji,
  text,
  arrowDirection = "right",
  className,
}: Props) {
  return (
    <article
      className={classNames(
        "projectImpactsOnboardingExample projectImpactsOnboardingExample__arrow",
        arrowDirection === "left" && "projectImpactsOnboardingExample__arrow--flipped",
        className,
      )}
    >
      <ExampleFigure>
        <RoundedIcon ariaLabel={`Pictogramme pour l'exemple "${name}"`}>{emoji}</RoundedIcon>
        <ExampleName>{name}</ExampleName>
      </ExampleFigure>
      <p className="tw-mt-10">{text}</p>
    </article>
  );
}
