import { routes } from "@/shared/views/router";

import CreateUserFormContainer from "./CreateUserForm";

function OnBoardingIdentityPage() {
  return (
    <CreateUserFormContainer
      createdFrom="features_app"
      onSuccess={() => {
        const redirectTo = `${window.location.origin}${routes.onBoardingIntroductionWhy().href}`;

        window.location.href = `/api/auth/login/pro-connect?noPrompt=true&redirectTo=${redirectTo}`;
      }}
    />
  );
}

export default OnBoardingIdentityPage;
