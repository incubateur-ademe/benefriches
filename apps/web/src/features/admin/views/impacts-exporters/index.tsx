import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { routes } from "@/app/router";

import { adminImpactsExportersListRequested } from "../../core/actions/adminImpactsExportersListRequested.action";
import { selectAdminImpactsExportersViewData } from "../../core/admin.selectors";
import AdminImpactsExportersPage from "./AdminImpactsExportersPage";

type Props = {
  search?: string;
  page?: number;
};

function AdminImpactsExportersPageContainer({ search, page }: Props) {
  const dispatch = useAppDispatch();
  const viewData = useAppSelector(selectAdminImpactsExportersViewData);

  useEffect(() => {
    void dispatch(adminImpactsExportersListRequested({ search, page }));
  }, [dispatch, search, page]);

  return (
    <AdminImpactsExportersPage
      viewData={viewData}
      onSearchSubmitted={(newSearch) => {
        routes.adminImpactsExporters({ search: newSearch || undefined, page: undefined }).push();
      }}
    />
  );
}

export default AdminImpactsExportersPageContainer;
