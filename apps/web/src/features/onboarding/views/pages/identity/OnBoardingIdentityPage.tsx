import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import { routes } from "@/shared/views/router";

import CreateUserFormContainer from "./CreateUserForm";

function OnBoardingIdentityPage() {
  return (
    <>
      <HtmlTitle>Identité - Introduction</HtmlTitle>
      <CreateUserFormContainer
        onSuccess={() => {
          routes.onBoardingIntroductionWhy().push();
        }}
      />
    </>
  );
}

export default OnBoardingIdentityPage;
