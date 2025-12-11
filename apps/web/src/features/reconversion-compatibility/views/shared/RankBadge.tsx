import classNames from "@/shared/views/clsx";

const getRankColor = (rank: number): string => {
  switch (rank) {
    case 1:
      return "bg-gold";
    case 2:
      return "bg-silver";
    case 3:
      return "bg-bronze";
    default:
      return "bg-background-light";
  }
};

type Props = {
  rank: number;
};

export default function RankBadge({ rank }: Props) {
  return (
    <div
      className={classNames(
        getRankColor(rank),
        "text-black",
        "flex justify-center items-center font-bold rounded-full",
        "h-12 w-12 text-xl",
      )}
    >
      {rank}
    </div>
  );
}
