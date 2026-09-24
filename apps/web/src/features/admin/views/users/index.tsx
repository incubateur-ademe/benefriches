import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { routes } from "@/app/router";

import { fetchAdminUsers } from "../../core/actions/fetchAdminUsers.action";
import { selectAdminUsersViewData } from "../../core/admin.selectors";
import AdminUsersPage from "./AdminUsersPage";

type Props = {
  search?: string;
  page?: number;
};

function AdminUsersPageContainer({ search, page }: Props) {
  const dispatch = useAppDispatch();
  const viewData = useAppSelector(selectAdminUsersViewData);

  useEffect(() => {
    void dispatch(fetchAdminUsers({ search, page }));
  }, [dispatch, search, page]);

  return (
    <AdminUsersPage
      viewData={viewData}
      onSearchSubmitted={(newSearch) => {
        routes.adminUsers({ search: newSearch || undefined, page: undefined }).push();
      }}
    />
  );
}

export default AdminUsersPageContainer;
