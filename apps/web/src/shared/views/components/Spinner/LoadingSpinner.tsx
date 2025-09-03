import classNames, { ClassValue } from "../../clsx";

type Props = {
  loadingText?: string;
  classes?: { text?: ClassValue };
};

const LoadingSpinner = ({ loadingText = "Chargement", classes }: Props) => {
  return (
    <div className="flex flex-col items-center py-8">
      <div
        aria-label="Chargement..."
        role="status"
        className="flex justify-center items-center h-16"
      >
        <div className="relative inline-flex">
          <div className="w-8 h-8 bg-blue-medium rounded-full"></div>
          <div className="w-8 h-8 bg-blue-medium rounded-full absolute top-0 left-0 animate-ping"></div>
          <div className="w-8 h-8 bg-blue-medium rounded-full absolute top-0 left-0 animate-pulse"></div>
        </div>
      </div>
      <span className={classNames("font-bold", "uppercase", classes?.text)}>{loadingText}</span>
    </div>
  );
};

export default LoadingSpinner;
