import { routes } from "@/app/views/router";
import CreateUserForm from "@/features/users/views/CreateUserForm";

function AppDemoIdentity() {
  return (
    <CreateUserForm
      onSuccess={() => {
        routes.demoMyProjects().push();
      }}
    />
  );
}

export default AppDemoIdentity;
