import { appApi } from "@/redux/services/appApi";

export type AdminNotification = {
  id: number;
  recipient_id: number;
  recipient_type: "admin";
  type: string;
  title: string;
  message: string;
  data: unknown;
  is_read: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminNotificationMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type AdminNotificationResponse = {
  response: {
    status: string;
    message: string;
  };
  data: AdminNotification[];
  meta: AdminNotificationMeta;
};

export const adminNotificationApiSlice = appApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminDepositNotifications: build.query<
      AdminNotificationResponse,
      { page?: number; perPage?: number }
    >({
      query: ({ page = 1, perPage = 100 } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        return `notifications/deposit/all?${params.toString()}`;
      },
      transformResponse: (response: AdminNotificationResponse) => response,
      providesTags: () => [{ type: "adminDepositNotifications" }],
    }),
    getAdminWithdrawNotifications: build.query<
      AdminNotificationResponse,
      { page?: number; perPage?: number }
    >({
      query: ({ page = 1, perPage = 100 } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        return `notifications/withdraw/all?${params.toString()}`;
      },
      transformResponse: (response: AdminNotificationResponse) => response,
      providesTags: () => [{ type: "adminWithdrawNotifications" }],
    }),
    markAdminDepositNotificationsRead: build.mutation<void, void>({
      query: () => ({
        url: "notifications/deposit/read",
        method: "POST",
      }),
      invalidatesTags: () => [{ type: "adminDepositNotifications" }],
    }),
    markAdminWithdrawNotificationsRead: build.mutation<void, void>({
      query: () => ({
        url: "notifications/withdraw/read",
        method: "POST",
      }),
      invalidatesTags: () => [{ type: "adminWithdrawNotifications" }],
    }),
  }),
});

export const { useGetAdminDepositNotificationsQuery, useGetAdminWithdrawNotificationsQuery } =
  adminNotificationApiSlice;

export const {
  useMarkAdminDepositNotificationsReadMutation,
  useMarkAdminWithdrawNotificationsReadMutation,
} = adminNotificationApiSlice;
