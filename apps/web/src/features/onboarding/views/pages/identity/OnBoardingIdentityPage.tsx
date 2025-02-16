import { routes } from "@/shared/views/router";

import CreateUserFormContainer from "./CreateUserForm";

function OnBoardingIdentityPage() {
  return (
    <CreateUserFormContainer
      createdFrom="features_app"
      onSuccess={() => {
        routes.onBoardingIntroductionWhy().push();
      }}
    />
  );
}

export default OnBoardingIdentityPage;
