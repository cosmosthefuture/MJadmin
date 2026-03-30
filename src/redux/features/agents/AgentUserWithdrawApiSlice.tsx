import { agentAppApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type AgentUserWithdrawActionBy = {
  id: number;
  name: string;
  phone_number: string;
  username: string;
  agent_code: string;
  winning_commission_percentage: number;
  master_id: number;
  status: string;
  force_reset_password: boolean;
  is_default: number;
  last_logined: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  balance: string;
};

export type AgentUserWithdrawUser = {
  id: number;
  identification_code: string;
  name: string;
  username: string;
  phone_number: string;
  email: string;
  agent_code: string;
  status: string;
  is_verified: boolean;
  last_logined: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  balance: string;
};

export type AgentUserWithdrawItem = {
  id: number;
  user_id: number;
  amount: number;
  action_by: AgentUserWithdrawActionBy;
  date_time: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: AgentUserWithdrawUser;
};

export type AgentUserWithdrawMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type AgentUserWithdrawResponse = {
  response: {
    status: string;
    message: string;
  };
  data: AgentUserWithdrawItem[];
  meta: AgentUserWithdrawMeta;
};

export const agentUserWithdrawApiSlice = agentAppApi.injectEndpoints({
  endpoints: (build) => ({
    getAgentUserWithdrawLists: build.query<
      AgentUserWithdrawResponse,
      { page?: number; perPage?: number; search?: string }
    >({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE, search } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        if (search) params.set("search", search);
        return `users/withdraw-lists?${params.toString()}`;
      },
      transformResponse: (response: AgentUserWithdrawResponse) => response,
      providesTags: () => [{ type: "agentUserWithdraws" }],
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetAgentUserWithdrawListsQuery } = agentUserWithdrawApiSlice;
