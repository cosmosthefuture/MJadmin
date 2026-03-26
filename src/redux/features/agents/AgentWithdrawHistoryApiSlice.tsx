import { agentAppApi } from "@/redux/services/appApi";

export type AgentWithdrawHistoryAgent = {
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

export type AgentWithdrawHistoryPaymentMethod = {
  id: number;
  type: string;
  account_username: string;
  phone_number: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type AgentWithdrawHistoryItem = {
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
  agent: AgentWithdrawHistoryAgent;
  payment_method: AgentWithdrawHistoryPaymentMethod;
};

export type AgentWithdrawHistoryMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type AgentWithdrawHistoryResponse = {
  response: {
    status: string;
    message: string;
  };
  data: AgentWithdrawHistoryItem[];
  meta: AgentWithdrawHistoryMeta;
};

export type GetAgentWithdrawHistoryParams = {
  page: number;
  per_page: number;
};

export const agentWithdrawHistoryApiSlice = agentAppApi.injectEndpoints({
  endpoints: (build) => ({
    getAgentWithdrawHistory: build.query<
      AgentWithdrawHistoryResponse,
      GetAgentWithdrawHistoryParams
    >({
      query: ({ page, per_page }) => ({
        url: `/withdraw-history?page=${page}&per_page=${per_page}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAgentWithdrawHistoryQuery } = agentWithdrawHistoryApiSlice;
