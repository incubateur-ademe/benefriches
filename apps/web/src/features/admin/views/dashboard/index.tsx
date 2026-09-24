import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";

import { fetchAdminDashboardStats } from "../../core/actions/fetchAdminDashboardStats.action";
import { selectAdminDashboardViewData } from "../../core/admin.selectors";
import AdminDashboardPage from "./AdminDashboardPage";

function AdminDashboardPageContainer() {
  const dispatch = useAppDispatch();
  const { loadingState, stats } = useAppSelector(selectAdminDashboardViewData);

  useEffect(() => {
    void dispatch(fetchAdminDashboardStats());
  }, [dispatch]);

  return <AdminDashboardPage loadingState={loadingState} stats={stats} />;
}

export default AdminDashboardPageContainer;
