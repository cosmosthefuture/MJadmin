import { agentAppApi } from "@/redux/services/appApi";

type AgentUserT = {
  id: number;
  name: string;
  username: string;
  phone_number: string;
  email: string;
  agent_code: string;
  status: string;
  is_verified: boolean;
  last_logined: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  balance: string;
};

export type AgentIncentiveTransactionT = {
  date_time: string;
  user: AgentUserT;
  deposit_amount: number;
  incentive_percentage: number;
  incentive_amount: number;
};

type MetaT = {
  total: number;
  per_page: string;
  current_page: string;
  total_pages: number;
};

export type GetAgentIncentiveTransactionsResponseT = {
  response: {
    status: string;
    message: string;
  };
  data: AgentIncentiveTransactionT[];
  meta: MetaT;
};

type GetAgentIncentiveTransactionsParamsT = {
  page: number;
  per_page: number;
};

export const agentIncentiveTransactionApiSlice = agentAppApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgentIncentiveTransactions: builder.query<
      GetAgentIncentiveTransactionsResponseT,
      GetAgentIncentiveTransactionsParamsT
    >({
      query: ({ page, per_page }) => ({
        url: `/incentive-transactions?page=${page}&per_page=${per_page}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAgentIncentiveTransactionsQuery } = agentIncentiveTransactionApiSlice;
