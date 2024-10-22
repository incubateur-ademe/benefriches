import { routes } from "@/app/views/router";

import CreateUserForm from "../../users/views/CreateUserForm";

function OnBoardingIdentityPage() {
  return (
    <CreateUserForm
      onSuccess={() => {
        routes.onBoardingIntroductionWhy().push();
      }}
    />
  );
}

export default OnBoardingIdentityPage;