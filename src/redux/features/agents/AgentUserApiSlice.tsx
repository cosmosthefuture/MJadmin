import { agentAppApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type AgentUserItem = {
  id: number;
  identification_code: string;
  name: string;
  username: string;
  phone_number: string;
  email?: string;
  agent_code: string;
  status: string;
  is_verified: boolean;
  last_logined: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  balance: string;
};

export type AgentUserMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type AgentUserListResponse = {
  response: {
    status: string;
    message: string;
  };
  data: AgentUserItem[];
  meta: AgentUserMeta;
};

export type AgentUserDetailResponse = {
  response: {
    status: string;
    message: string;
  };
  data: AgentUserItem;
};

export type AgentCreateUserPayload = {
  name: string;
  email?: string;
  phone_number: string;
  username: string;
};

export type AgentUpdateUserPayload = {
  id: number;
  name: string;
  email?: string;
  phone_number: string;
  username: string;
};

export type AgentVerifyUserPayload = {
  id: number;
  password?: string;
  password_confirmation?: string;
};

export type AgentResetPasswordPayload = {
  id: number;
  password?: string;
  password_confirmation?: string;
};

export type AgentAddMoneyPayload = {
  user_id: number;
  amount: string;
};

export type AgentWithdrawMoneyPayload = {
  user_id: number;
  amount: string;
};

export const agentUserApiSlice = agentAppApi.injectEndpoints({
  endpoints: (build) => ({
    getAgentUsers: build.query<
      AgentUserListResponse,
      { page?: number; perPage?: number; search?: string }
    >({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE, search } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        if (search) params.set("search", search);
        return `users/all?${params.toString()}`;
      },
      transformResponse: (response: AgentUserListResponse) => response,
      providesTags: () => [{ type: "agentUsers" }],
    }),
    getAgentUserById: build.query<AgentUserItem, number>({
      query: (id) => `users/${id}`,
      transformResponse: (response: AgentUserDetailResponse) => response.data,
      providesTags: (_result, _error, id) => [{ type: "agentUserById", id }],
    }),
    createAgentUser: build.mutation<AgentUserDetailResponse, AgentCreateUserPayload>({
      query: (body) => ({
        url: "users",
        method: "POST",
        body,
      }),
      invalidatesTags: () => [{ type: "agentUsers" }],
    }),
    updateAgentUser: build.mutation<AgentUserDetailResponse, AgentUpdateUserPayload>({
      query: ({ id, ...body }) => ({
        url: `users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "agentUsers" },
        { type: "agentUserById", id },
      ],
    }),
    toggleAgentUserStatus: build.mutation<
      AgentUserDetailResponse,
      { id: number; deactivate: boolean }
    >({
      query: ({ id, deactivate }) => ({
        url: `users/${id}/toggle-status`,
        method: "PATCH",
        body: { deactivate },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "agentUsers" },
        { type: "agentUserById", id },
      ],
    }),
    verifyAgentUser: build.mutation<AgentUserDetailResponse, AgentVerifyUserPayload>({
      query: ({ id, password, password_confirmation }) => ({
        url: `users/${id}/verify`,
        method: "PUT",
        body: {
          ...(password ? { password } : {}),
          ...(password_confirmation ? { password_confirmation } : {}),
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "agentUsers" },
        { type: "agentUserById", id },
      ],
    }),
    resetAgentUserPassword: build.mutation<AgentUserDetailResponse, AgentResetPasswordPayload>({
      query: ({ id, password, password_confirmation }) => ({
        url: `users/${id}/reset-password`,
        method: "PUT",
        body: { password, password_confirmation },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "agentUsers" },
        { type: "agentUserById", id },
      ],
    }),
    addMoneyToAgentUser: build.mutation<AgentUserDetailResponse, AgentAddMoneyPayload>({
      query: (body) => ({
        url: "users/add-money",
        method: "POST",
        body,
      }),
      invalidatesTags: () => [{ type: "agentUsers" }],
    }),
    withdrawMoneyFromAgentUser: build.mutation<AgentUserDetailResponse, AgentWithdrawMoneyPayload>({
      query: (body) => ({
        url: "users/withdraw-money",
        method: "POST",
        body,
      }),
      invalidatesTags: () => [{ type: "agentUsers" }],
    }),
  }),
});

export const {
  useGetAgentUsersQuery,
  useGetAgentUserByIdQuery,
  useCreateAgentUserMutation,
  useUpdateAgentUserMutation,
  useToggleAgentUserStatusMutation,
  useVerifyAgentUserMutation,
  useResetAgentUserPasswordMutation,
  useAddMoneyToAgentUserMutation,
  useWithdrawMoneyFromAgentUserMutation,
} = agentUserApiSlice;
