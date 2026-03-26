import { appApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type AgentWithdrawRequestAgent = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  username: string;
  agent_code: string;
  incentive_percentage: number;
  master_id: number;
  status: string;
  force_reset_password: boolean;
  last_logined: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type AgentWithdrawRequestPaymentMethod = {
  id: number;
  type: string;
  account_username: string;
  phone_number: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type AgentWithdrawRequestItem = {
  id: number;
  agent_id: number;
  payment_method_id: number;
  amount: number;
  receiver_phone_number: string;
  status: "pending" | "approved" | "rejected";
  reason_for_rejection: string | null;
  action_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  agent: AgentWithdrawRequestAgent;
  payment_method: AgentWithdrawRequestPaymentMethod;
};

export type AgentWithdrawRequestMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type AgentWithdrawRequestResponse = {
  response: {
    status: string;
    message: string;
  };
  data: AgentWithdrawRequestItem[];
  meta: AgentWithdrawRequestMeta;
};

export const agentWithdrawRequestApiSlice = appApi.injectEndpoints({
  endpoints: (build) => ({
    getAgentWithdrawRequests: build.query<
      AgentWithdrawRequestResponse,
      { page?: number; perPage?: number; search?: string }
    >({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE, search } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        if (search) params.set("search", search);
        return `agent-withdraw-requests/all?${params.toString()}`;
      },
      transformResponse: (response: AgentWithdrawRequestResponse) => response,
      providesTags: () => [{ type: "agentWithdrawRequests" }],
      keepUnusedDataFor: 0, // Do not keep cached data when not in use
    }),
    approveAgentWithdrawRequest: build.mutation<AgentWithdrawRequestResponse, { id: number }>({
      query: ({ id }) => ({
        url: `agent-withdraw-requests/${id}/approve`,
        method: "PUT",
      }),
      invalidatesTags: () => [{ type: "agentWithdrawRequests" }],
    }),
    rejectAgentWithdrawRequest: build.mutation<
      AgentWithdrawRequestResponse,
      { id: number; reason_for_rejection: string }
    >({
      query: ({ id, reason_for_rejection }) => ({
        url: `agent-withdraw-requests/${id}/reject`,
        method: "PUT",
        body: { reason_for_rejection },
      }),
      invalidatesTags: () => [{ type: "agentWithdrawRequests" }],
    }),
  }),
});

export const {
  useGetAgentWithdrawRequestsQuery,
  useApproveAgentWithdrawRequestMutation,
  useRejectAgentWithdrawRequestMutation,
} = agentWithdrawRequestApiSlice;
