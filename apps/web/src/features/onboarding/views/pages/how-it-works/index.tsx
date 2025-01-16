import { routes } from "@/app/views/router";

import OnBoardingIntroductionHow from "./HowItWorksPage";

const OnBoardingIntroductionHowContainer = () => {
  return (
    <OnBoardingIntroductionHow
      nextLinkProps={routes.createSiteFoncier().link}
      backLinkProps={routes.onBoardingIntroductionWhy().link}
    />
  );
};

export default OnBoardingIntroductionHowContainer;
