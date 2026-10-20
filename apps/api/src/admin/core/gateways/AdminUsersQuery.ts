import type { LifecycleEmailDeliveryStatus, LifecycleEmailType } from "shared";

export type AdminUserRecord = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  structureName: string | null;
  structureType: string;
  structureActivity: string;
  subscribedToNewsletter: boolean;
  lifecycleEmailsUnsubscribedAt: Date | null;
  createdAt: Date;
};

export type AdminUserListItem = Omit<
  AdminUserRecord,
  "subscribedToNewsletter" | "lifecycleEmailsUnsubscribedAt"
> & {
  lastLoginAt: Date | null;
};

export type AdminUserSiteRecord = {
  id: string;
  name: string;
  nature: string;
  creationMode: string;
  status: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type AdminUserProjectRecord = {
  id: string;
  name: string;
  siteId: string;
  creationMode: string;
  status: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type AdminUserCompatibilityEvaluationRecord = {
  id: string;
  siteId: string | null;
  status: string | null;
  createdAt: Date;
  completedAt: Date | null;
};

export type AdminUserLifecycleEmailDeliveryRecord = {
  emailType: LifecycleEmailType;
  status: LifecycleEmailDeliveryStatus;
  relatedEntityName: string | null;
  sentAt: Date | null;
  lastAttemptedAt: Date;
  attempts: number;
  errorMessage: string | null;
};

export type AdminUserActivityRecord = {
  user: AdminUserRecord;
  loginDates: Date[];
  sites: AdminUserSiteRecord[];
  projects: AdminUserProjectRecord[];
  compatibilityEvaluations: AdminUserCompatibilityEvaluationRecord[];
  lifecycleEmailDeliveries: AdminUserLifecycleEmailDeliveryRecord[];
};

export interface AdminUsersQuery {
  list(props: { search?: string; page: number; pageSize: number }): Promise<{
    users: AdminUserListItem[];
    total: number;
  }>;
  getUserActivity(userId: string): Promise<AdminUserActivityRecord | undefined>;
}
