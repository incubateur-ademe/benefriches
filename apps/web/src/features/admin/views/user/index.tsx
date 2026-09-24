import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";

import { fetchAdminUserActivity } from "../../core/actions/fetchAdminUserActivity.action";
import { selectAdminUserViewData } from "../../core/admin.selectors";
import AdminUserPage from "./AdminUserPage";

type Props = {
  userId: string;
};

function AdminUserPageContainer({ userId }: Props) {
  const dispatch = useAppDispatch();
  const viewData = useAppSelector(selectAdminUserViewData);

  useEffect(() => {
    void dispatch(fetchAdminUserActivity(userId));
  }, [dispatch, userId]);

  return <AdminUserPage viewData={viewData} />;
}

export default AdminUserPageContainer;
