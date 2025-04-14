import { siteCreationInitiated } from "@/features/create-site/core/actions/introduction.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { routes } from "@/shared/views/router";

import OnBoardingIntroductionHow from "./HowItWorksPage";

const OnBoardingIntroductionHowContainer = () => {
  const dispatch = useAppDispatch();

  return (
    <OnBoardingIntroductionHow
      nextLinkProps={{
        onClick: () => {
          dispatch(siteCreationInitiated({ skipIntroduction: true }));
          routes.createSiteFoncier().push();
        },
      }}
      backLinkProps={routes.onBoardingIntroductionWhy().link}
    />
  );
};

export default OnBoardingIntroductionHowContainer;
