import { ReactNode } from "react";

import classNames, { ClassValue } from "@/shared/views/clsx";

type Props = {
  emoji: ReactNode;
  children: ReactNode;
  smallText?: boolean;
  classes?: { root?: ClassValue; emoji?: ClassValue };
  size?: "large" | "medium";
};

const SIZES = {
  large: ["w-14", "h-14", "-left-18", "top-[calc(50%-28px)]"],
  medium: ["w-10 h-10", "-left-10 top-[calc(50%-20px)]"],
};

const EmojiListItem = ({ emoji, children, smallText = false, classes, size = "medium" }: Props) => (
  <li className={classNames("relative p-3", classes?.root)}>
    <span
      className={classNames(
        "absolute",
        "rounded-full",
        "flex",
        "justify-center",
        "items-center",
        ...SIZES[size],
        smallText ? "text-base" : "text-2xl",
        classes?.emoji,
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
