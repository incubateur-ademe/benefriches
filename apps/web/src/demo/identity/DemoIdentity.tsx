import { routes } from "@/app/views/router";
import CreateUserForm from "@/users/views/CreateUserForm";

function AppDemoIdentity() {
  return (
    <CreateUserForm
      createdFrom="demo_app"
      onSuccess={() => {
        routes.demoMyProjects().push();
      }}
    />
  );
}

export default AppDemoIdentity;
