import { agentAppApi } from "@/redux/services/appApi";

export type AgentDailyWalletSummaryItem = {
  id: number;
  agent_id: number;
  date: string;
  opening_balance: number;
  total_in: number;
  total_out: number;
  closing_balance: number;
  created_at: string;
  updated_at: string;
};

export type AgentDailyWalletSummaryMeta = {
  total: number;
  per_page: string;
  current_page: string;
  total_pages: number;
};

export type AgentDailyWalletSummaryResponse = {
  response: {
    status: string;
    message: string;
  };
  data: AgentDailyWalletSummaryItem[];
  meta: AgentDailyWalletSummaryMeta;
};

export type GetAgentDailyWalletSummaryParams = {
  page: number;
  per_page: number;
};

export const agentDailyWalletSummaryApiSlice = agentAppApi.injectEndpoints({
  endpoints: (build) => ({
    getAgentDailyWalletSummary: build.query<
      AgentDailyWalletSummaryResponse,
      GetAgentDailyWalletSummaryParams
    >({
      query: ({ page, per_page }) => ({
        url: `/daily-wallet-summary?page=${page}&per_page=${per_page}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAgentDailyWalletSummaryQuery } = agentDailyWalletSummaryApiSlice;
