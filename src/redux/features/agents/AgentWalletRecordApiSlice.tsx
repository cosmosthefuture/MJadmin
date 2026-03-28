import { DEFAULT_PER_PAGE } from "@/lib/constants";
import { agentAppApi } from "@/redux/services/appApi";

export type AgentWalletRecordItem = {
  id: number;
  agent_id: number;
  date_time: string;
  type: "in" | "out";
  amount: number;
  balance: number;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type AgentWalletRecordMeta = {
  total: number;
  per_page: string;
  current_page: string;
  total_pages: number;
};

export type AgentWalletRecordResponse = {
  response: {
    status: string;
    message: string;
  };
  data: AgentWalletRecordItem[];
  meta: AgentWalletRecordMeta;
};

export type GetAgentWalletRecordParams = {
  page?: number;
  per_page?: number;
};

export const agentWalletRecordApiSlice = agentAppApi.injectEndpoints({
  endpoints: (build) => ({
    getAgentWalletRecords: build.query<AgentWalletRecordResponse, GetAgentWalletRecordParams>({
      query: ({ page = 1, per_page = DEFAULT_PER_PAGE } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", per_page.toString());
        return `wallet-records?${params.toString()}`;
      },
      transformResponse: (response: AgentWalletRecordResponse) => response,
      providesTags: () => [{ type: "agentWalletRecords" }],
    }),
  }),
});

export const { useGetAgentWalletRecordsQuery } = agentWalletRecordApiSlice;
