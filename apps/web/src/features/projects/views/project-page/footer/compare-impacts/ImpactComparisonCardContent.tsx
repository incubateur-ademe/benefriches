import classNames from "@/shared/views/clsx";

type Props = {
  title: string;
  imgSrc: string;
  descriptionItems: string[];
};

export default function ImpactComparisonCardContent({ title, imgSrc, descriptionItems }: Props) {
  return (
    <>
      <div className={classNames("tw-flex tw-items-center tw-gap-4", "tw-text-xl", "tw-font-bold")}>
        <img
          src={imgSrc}
          width="80px"
          height="80px"
          aria-hidden="true"
          alt=""
          className={classNames("tw-mb-2", "tw-w-14 tw-h-14")}
        />
        {title}
      </div>
      <ul className="tw-text-base tw-list-none tw-p-0 tw-m-0 tw-pt-6">
        {descriptionItems.map((item) => (
          <li key={item} className="tw-pb-4">
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
