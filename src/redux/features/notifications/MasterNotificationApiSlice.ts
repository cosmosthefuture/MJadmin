import { masterAppApi } from "@/redux/services/appApi";

export type MasterNotification = {
  id: number;
  recipient_id: number;
  recipient_type: "master";
  type: string;
  title: string;
  message: string;
  data: unknown;
  is_read: boolean;
  created_at: string;
  updated_at: string;
};

export type MasterNotificationMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type MasterNotificationResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MasterNotification[];
  meta: MasterNotificationMeta;
};

export const masterNotificationApiSlice = masterAppApi.injectEndpoints({
  endpoints: (build) => ({
    getMasterNotifications: build.query<
      MasterNotificationResponse,
      { page?: number; perPage?: number }
    >({
      query: ({ page = 1, perPage = 100 } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        return `notifications/all?${params.toString()}`;
      },
      transformResponse: (response: MasterNotificationResponse) => response,
      providesTags: () => [{ type: "masterNotifications" }],
    }),
    markMasterNotificationsRead: build.mutation<void, void>({
      query: () => ({
        url: "notifications/read",
        method: "POST",
      }),
      invalidatesTags: () => [{ type: "masterNotifications" }],
    }),
  }),
});

export const { useGetMasterNotificationsQuery } = masterNotificationApiSlice;

export const { useMarkMasterNotificationsReadMutation } = masterNotificationApiSlice;
