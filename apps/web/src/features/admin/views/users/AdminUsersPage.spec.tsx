import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { createStore } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { InMemoryAdminService } from "../../infrastructure/admin-service/InMemoryAdminService";
import AdminUsersPageContainer from "./index";

describe("AdminUsersPage", () => {
  it('shows "Accès réservé" when the admin API answers 403', async () => {
    const adminService = new InMemoryAdminService({ shouldDenyAccess: true });
    render(
      <Provider store={createStore(getTestAppDependencies({ adminService }))}>
        <AdminUsersPageContainer />
      </Provider>,
    );

    expect(await screen.findByText("Accès réservé aux administrateurs")).toBeInTheDocument();
    expect(screen.queryByRole("status", { name: "Chargement..." })).not.toBeInTheDocument();
  });
});
