import { agentAppApi } from "@/redux/services/appApi";

const DEFAULT_AGENT_PER_PAGE = 10;

export type AgentDailyCashbookRecordItem = {
  id: number;
  agent_id: number;
  date: string;
  member_id: string | null;
  deposit: number | null;
  incentive_percentage: number | null;
  amount: number | null;
  withdraw: number | null;
  balance: number | null;
  created_at: string;
  updated_at: string;
};

export type AgentDailyCashbookRecordMeta = {
  total: number;
  per_page: string;
  current_page: string;
  total_pages: number;
};

export type AgentDailyCashbookRecordResponse = {
  response: {
    status: string;
    message: string;
  };
  data: AgentDailyCashbookRecordItem[];
  meta: AgentDailyCashbookRecordMeta;
};

export type GetAgentDailyCashbookRecordParams = {
  page?: number;
  per_page?: number;
  from?: string;
  to?: string;
};

export const agentDailyCashbookRecordApiSlice = agentAppApi.injectEndpoints({
  endpoints: (build) => ({
    getAgentDailyCashbookRecords: build.query<
      AgentDailyCashbookRecordResponse,
      GetAgentDailyCashbookRecordParams
    >({
      query: ({ page = 1, per_page = DEFAULT_AGENT_PER_PAGE, from, to } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", per_page.toString());

        if (from) {
          params.set("from", from);
        }

        if (to) {
          params.set("to", to);
        }

        return `daily-cashbook-records?${params.toString()}`;
      },
      transformResponse: (response: AgentDailyCashbookRecordResponse) => response,
      providesTags: () => [{ type: "agentDailyCashbookRecords" }],
    }),
  }),
});

export const { useGetAgentDailyCashbookRecordsQuery } = agentDailyCashbookRecordApiSlice;
