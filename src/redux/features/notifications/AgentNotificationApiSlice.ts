import { agentAppApi } from "@/redux/services/appApi";

export type AgentNotification = {
  id: number;
  recipient_id: number;
  recipient_type: "agent";
  type: string;
  title: string;
  message: string;
  data: unknown;
  is_read: boolean;
  created_at: string;
  updated_at: string;
};

export type AgentNotificationMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type AgentNotificationResponse = {
  response: {
    status: string;
    message: string;
  };
  data: AgentNotification[];
  meta: AgentNotificationMeta;
};

export const agentNotificationApiSlice = agentAppApi.injectEndpoints({
  endpoints: (build) => ({
    getAgentNotifications: build.query<
      AgentNotificationResponse,
      { page?: number; perPage?: number }
    >({
      query: ({ page = 1, perPage = 100 } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        return `notifications/all?${params.toString()}`;
      },
      transformResponse: (response: AgentNotificationResponse) => response,
      providesTags: () => [{ type: "agentNotifications" }],
    }),
    markAgentNotificationsRead: build.mutation<void, void>({
      query: () => ({
        url: "notifications/read",
        method: "POST",
      }),
      invalidatesTags: () => [{ type: "agentNotifications" }],
    }),
  }),
});

export const { useGetAgentNotificationsQuery } = agentNotificationApiSlice;

export const { useMarkAgentNotificationsReadMutation } = agentNotificationApiSlice;
