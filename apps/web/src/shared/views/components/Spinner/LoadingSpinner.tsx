const LoadingSpinner = ({ loadingText = "Chargement" }: { loadingText?: string }) => {
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-py-8">
      <div
        aria-label="Chargement..."
        role="status"
        className="tw-flex tw-justify-center tw-items-center tw-h-16"
      >
        <div className="tw-relative tw-inline-flex">
          <div className="tw-w-8 tw-h-8 tw-bg-blue-main tw-rounded-full"></div>
          <div className="tw-w-8 tw-h-8 tw-bg-blue-main tw-rounded-full tw-absolute tw-top-0 tw-left-0 tw-animate-ping"></div>
          <div className="tw-w-8 tw-h-8 tw-bg-blue-main tw-rounded-full tw-absolute tw-top-0 tw-left-0 tw-animate-pulse"></div>
        </div>
      </div>
      <span className="tw-font-bold tw-uppercase">{loadingText}</span>
    </div>
  );
};

export default LoadingSpinner;
