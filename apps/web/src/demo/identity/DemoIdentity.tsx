import CreateUserForm from "@/features/onboarding/views/pages/identity/CreateUserForm";
import { routes } from "@/shared/views/router";

function AppDemoIdentity() {
  return (
    <CreateUserForm
      createdFrom="demo_app"
      onSuccess={() => {
        routes.demoOnBoardingIntroductionWhy().push();
      }}
    />
  );
}

export default AppDemoIdentity;
