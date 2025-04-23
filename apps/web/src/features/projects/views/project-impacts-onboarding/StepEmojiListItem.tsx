import { ReactNode } from "react";

import classNames, { ClassValue } from "@/shared/views/clsx";

type Props = {
  emoji: ReactNode;
  children: ReactNode;
  small?: boolean;
  emojiClassName?: ClassValue;
};

const EmojiListItem = ({ emoji, children, small = false, emojiClassName }: Props) => (
  <li className="tw-relative tw-p-3">
    <span
      className={classNames(
        "tw-absolute",
        "tw-w-10 tw-h-10",
        "-tw-left-10 tw-top-[calc(50%-20px)]",
        "tw-rounded-full",
        "tw-flex",
        "tw-justify-center",
        "tw-items-center",
        small ? "tw-text-base" : "tw-text-2xl",
        emojiClassName,
      )}
      aria-hidden="true"
      role="img"
    >
      {emoji}
    </span>
    {children}
  </li>
);

export default EmojiListItem;
