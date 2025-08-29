import { ReactNode } from "react";

import classNames, { ClassValue } from "@/shared/views/clsx";

type Props = {
  emoji: ReactNode;
  children: ReactNode;
  small?: boolean;
  emojiClassName?: ClassValue;
};

const EmojiListItem = ({ emoji, children, small = false, emojiClassName }: Props) => (
  <li className="relative p-3">
    <span
      className={classNames(
        "absolute",
        "w-10 h-10",
        "-left-10 top-[calc(50%-20px)]",
        "rounded-full",
        "flex",
        "justify-center",
        "items-center",
        small ? "text-base" : "text-2xl",
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
