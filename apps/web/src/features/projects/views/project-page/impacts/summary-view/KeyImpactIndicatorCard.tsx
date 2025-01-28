import { fr } from "@codegouvfr/react-dsfr";

import classNames from "@/shared/views/clsx";

type Props = {
  title: string;
  type: "success" | "error";
  description?: string;
  onClick?: () => void;
};

const KeyImpactIndicatorCard = ({ title, type, description, onClick }: Props) => {
  const actionProps = onClick
    ? {
        tabIndex: 0,
        onClick,
        onKeyUp: (e: React.KeyboardEvent<HTMLElement>) => {
          if (e.key === "Enter") {
            onClick();
          }
        },
      }
    : {};
  return (
    <article
      {...actionProps}
      className={classNames(
        "tw-flex tw-justify-start tw-items-center tw-gap-4",
        "tw-p-4",
        "tw-rounded-md",
        "tw-border tw-border-solid tw-border-transparent",
        type === "success"
          ? ["tw-bg-impacts-positive-light", "dark:tw-bg-impacts-positive-main"]
          : ["tw-bg-impacts-negative-light", "dark:tw-bg-impacts-negative-main"],
        onClick && [
          "tw-cursor-pointer",
          "tw-transition tw-ease-in-out tw-duration-500",
          type === "success"
            ? "hover:tw-border-impacts-positive-border hover:tw-scale-x-105"
            : "hover:tw-border-impacts-negative-border hover:tw-scale-x-105",
        ],
      )}
    >
      <span
        className={classNames(
          "fr-icon--xxl",
          type === "success"
            ? [fr.cx("fr-icon-checkbox-circle-fill"), "tw-text-impacts-positive-border"]
            : [fr.cx("fr-icon-warning-fill"), "tw-text-impacts-negative-border"],
        )}
        aria-hidden="true"
      ></span>
      <div>
        <h3 className="tw-text-lg tw-font-bold tw-mb-0">{title}</h3>
        {description && <p className="tw-pt-2 tw-m-0 dark:tw-text-grey-light">{description}</p>}
      </div>
    </article>
  );
};

export default KeyImpactIndicatorCard;
