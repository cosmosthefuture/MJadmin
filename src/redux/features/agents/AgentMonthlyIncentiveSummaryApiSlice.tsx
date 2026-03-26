import { agentAppApi } from "@/redux/services/appApi";

export type AgentMonthlyIncentiveSummaryItem = {
  id: number;
  agent_id: number;
  month: string;
  total_deposit_amount: number;
  total_incentive_amount: number;
  created_at: string;
  updated_at: string;
};

export type AgentMonthlyIncentiveSummaryMeta = {
  total: number;
  per_page: string;
  current_page: string;
  total_pages: number;
};

export type AgentMonthlyIncentiveSummaryResponse = {
  response: {
    status: string;
    message: string;
  };
  data: AgentMonthlyIncentiveSummaryItem[];
  meta: AgentMonthlyIncentiveSummaryMeta;
};

export type GetAgentMonthlyIncentiveSummaryParams = {
  page: number;
  per_page: number;
};

export const agentMonthlyIncentiveSummaryApiSlice = agentAppApi.injectEndpoints({
  endpoints: (build) => ({
    getAgentMonthlyIncentiveSummary: build.query<
      AgentMonthlyIncentiveSummaryResponse,
      GetAgentMonthlyIncentiveSummaryParams
    >({
      query: ({ page, per_page }) => ({
        url: `/monthly-incentive-summary?page=${page}&per_page=${per_page}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAgentMonthlyIncentiveSummaryQuery } =
  agentMonthlyIncentiveSummaryApiSlice;
