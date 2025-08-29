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
    <CheckboxCard className="rounded-lg h-full" disabled={disabled} {...props}>
      <div className="p-6">
        <div className="text-center">
          {imgSrc && (
            <img
              src={imgSrc}
              width="80px"
              height="80px"
              alt=""
              aria-hidden="true"
              className={disabled ? "filter grayscale opacity-50 mb-2" : "mb-2"}
            />
          )}
          <div
            className={classNames("mb-2", !imgSrc && "mt-6", fr.cx("fr-text--lg", "fr-text--bold"))}
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
