import { masterAppApi } from "@/redux/services/appApi";

export type MasterAgentItem = {
  id: number;
  name: string;
  email?: string;
  phone_number: string;
  username: string;
  agent_code: string;
  winning_commission_percentage?: number;
  incentive_percentage?: number;
  master_id: number;
  status: string;
  force_reset_password: boolean;
  is_default?: number;
  last_logined: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  balance?: string;
  master?: {
    id: number;
    name: string;
    email?: string;
    phone_number: string;
    username: string;
    winning_commission_percentage?: number;
    incentive_percentage?: number;
    status: string;
    force_reset_password: boolean;
    is_default?: number;
    last_logined: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
};

export type MasterAgentMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type MasterAgentListResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MasterAgentItem[];
  meta: MasterAgentMeta;
};

export type CreateAgentPayload = {
  name: string;
  email?: string;
  phone_number: string;
  username: string;
  winning_commission_percentage: number;
  agent_code: string;
  password: string;
  password_confirmation: string;
};

export type UpdateAgentPayload = {
  id: number;
  name: string;
  email?: string;
  phone_number: string;
  username: string;
  winning_commission_percentage: number;
  agent_code: string;
};

export type AgentDetailResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MasterAgentItem;
};

export type AddMoneyToAgentPayload = {
  agent_id: number;
  amount: string;
};

export type WithdrawMoneyFromUserPayload = {
  user_id: number;
  amount: string;
};

export const masterAgentApiSlice = masterAppApi.injectEndpoints({
  endpoints: (build) => ({
    getMasterAgents: build.query<
      MasterAgentListResponse,
      {
        page: number;
        perPage?: number;
        search?: string;
      }
    >({
      query: ({ page, perPage = 10, search }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: perPage.toString(),
        });

        if (search) {
          params.append("search", search);
        }

        return `agents/all?${params.toString()}`;
      },
      providesTags: () => [{ type: "agentsApi" }],
    }),

    getAgentById: build.query<MasterAgentItem, number>({
      query: (id) => `agents/${id}`,
      transformResponse: (response: AgentDetailResponse) => response.data,
      providesTags: () => [{ type: "agentsApi" }],
    }),

    createAgent: build.mutation<unknown, CreateAgentPayload>({
      query: (payload) => ({
        url: "agents",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: () => [{ type: "agentsApi" }],
    }),

    updateAgent: build.mutation<unknown, UpdateAgentPayload>({
      query: ({ id, ...payload }) => ({
        url: `agents/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: () => [{ type: "agentsApi" }],
    }),

    addMoneyToAgent: build.mutation<unknown, AddMoneyToAgentPayload>({
      query: (payload) => ({
        url: "agents/add-money",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: () => [{ type: "agentsApi" }],
    }),

    withdrawMoneyFromAgent: build.mutation<unknown, AddMoneyToAgentPayload>({
      query: (payload) => ({
        url: "agents/withdraw-money",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: () => [{ type: "agentsApi" }],
    }),

    withdrawMoneyFromUser: build.mutation<unknown, WithdrawMoneyFromUserPayload>({
      query: (payload) => ({
        url: "agents/users/withdraw-money",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: () => [{ type: "agentsApi" }],
    }),

    toggleAgentStatus: build.mutation<unknown, { id: number; deactivate: boolean }>({
      query: ({ id, deactivate }) => ({
        url: `agents/${id}/toggle-status`,
        method: "PATCH",
        body: { deactivate },
      }),
      invalidatesTags: () => [{ type: "agentsApi" }],
    }),
  }),
});

export const {
  useGetMasterAgentsQuery,
  useGetAgentByIdQuery,
  useCreateAgentMutation,
  useUpdateAgentMutation,
  useAddMoneyToAgentMutation,
  useWithdrawMoneyFromAgentMutation,
  useWithdrawMoneyFromUserMutation,
  useToggleAgentStatusMutation,
} = masterAgentApiSlice;
