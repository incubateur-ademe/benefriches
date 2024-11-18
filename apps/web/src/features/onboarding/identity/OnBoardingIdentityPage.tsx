import { routes } from "@/app/views/router";

import CreateUserForm from "../../../users/views/CreateUserForm";

function OnBoardingIdentityPage() {
  return (
    <CreateUserForm
      createdFrom="features_app"
      onSuccess={() => {
        routes.onBoardingIntroductionWhy().push();
      }}
    />
  );
}

export default OnBoardingIdentityPage;
