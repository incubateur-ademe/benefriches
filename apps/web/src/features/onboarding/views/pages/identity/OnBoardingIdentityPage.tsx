import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import { routes } from "@/shared/views/router";

import CreateUserFormContainer from "./CreateUserForm";

function OnBoardingIdentityPage() {
  return (
    <>
      <HtmlTitle>Identité - Introduction</HtmlTitle>
      <CreateUserFormContainer
        onSuccess={() => {
          const redirectTo = `${window.location.origin}${routes.onBoardingIntroductionWhy().href}`;

          window.location.href = `/api/auth/login/pro-connect?noPrompt=true&redirectTo=${redirectTo}`;
        }}
      />
    </>
  );
}

export default OnBoardingIdentityPage;
