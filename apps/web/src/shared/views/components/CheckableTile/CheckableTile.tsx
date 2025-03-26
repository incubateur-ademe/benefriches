import { fr } from "@codegouvfr/react-dsfr";
import React from "react";

import classNames from "@/shared/views/clsx";

import CheckboxCard, { CheckboxCardProps } from "../CheckboxCard/CheckboxCard";

type Props = Omit<CheckboxCardProps, "children"> & {
  title: string;
  description?: React.ReactNode;
  imgSrc: string;
  disabled?: boolean;
};

export default function CheckableTile({ title, description, imgSrc, disabled, ...props }: Props) {
  return (
    <CheckboxCard className="tw-rounded-lg tw-h-full" disabled={disabled} {...props}>
      <div className="tw-p-6">
        <div className="tw-text-center">
          {imgSrc && (
            <img
              src={imgSrc}
              width="80px"
              height="80px"
              alt={`Illustration pour la tuile "${title}"`}
              className={disabled ? "tw-filter tw-grayscale tw-opacity-50 tw-mb-2" : "tw-mb-2"}
            />
          )}
          <div
            className={classNames(
              "tw-mb-2",
              !imgSrc && "tw-mt-6",
              fr.cx("fr-text--lg", "fr-text--bold"),
            )}
          >
            {title}
          </div>
          {description && (
            <legend className={fr.cx("fr-text--sm", "fr-mb-0")}>{description}</legend>
          )}
        </div>
      </div>
    </CheckboxCard>
  );
}
