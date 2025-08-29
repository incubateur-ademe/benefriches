import classNames from "@/shared/views/clsx";

type Props = {
  title: string;
  imgSrc: string;
  descriptionItems: string[];
};

export default function ImpactComparisonCardContent({ title, imgSrc, descriptionItems }: Props) {
  return (
    <>
      <div className={classNames("flex items-center gap-4", "text-xl", "font-bold")}>
        <img
          src={imgSrc}
          width="80px"
          height="80px"
          aria-hidden="true"
          alt=""
          className={classNames("mb-2", "w-14 h-14")}
        />
        {title}
      </div>
      <ul className="text-base list-none p-0 m-0 pt-6">
        {descriptionItems.map((item) => (
          <li key={item} className="pb-4">
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
