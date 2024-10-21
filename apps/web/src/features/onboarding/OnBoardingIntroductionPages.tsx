import { Route } from "type-route";

import { routes } from "@/app/views/router";

import OnBoardingIntroductionHow from "./how-it-works/HowItWorksPage";
import OnBoardingIntroductionWhyBenefriches from "./why-benefriches/WhyBenefrichesPage";

type Props = {
  route:
    | Route<typeof routes.onBoardingIntroductionHow>
    | Route<typeof routes.onBoardingIntroductionWhy>;
};

function OnBoardingIntroductionPages({ route }: Props) {
  switch (route.name) {
    case routes.onBoardingIntroductionWhy.name:
      return <OnBoardingIntroductionWhyBenefriches />;
    case routes.onBoardingIntroductionHow.name:
      return <OnBoardingIntroductionHow />;
  }
}

export default OnBoardingIntroductionPages;
