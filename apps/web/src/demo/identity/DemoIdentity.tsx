import { routes } from "@/app/views/router";
import CreateUserForm from "@/features/onboarding/views/pages/identity/CreateUserForm";

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
