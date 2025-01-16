import { routes } from "@/shared/views/router";

import WhyBenefrichesPage from "./WhyBenefrichesPage";

const OnBoardingIntroductionWhyBenefrichesContainer = () => {
  return (
    <WhyBenefrichesPage
      nextLinkProps={routes.onBoardingIntroductionHow().link}
      backLinkProps={routes.home().link}
    />
  );
};

export default OnBoardingIntroductionWhyBenefrichesContainer;
