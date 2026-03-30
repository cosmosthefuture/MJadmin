import { masterAppApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type MasterAgentDepositActionBy = {
  id: number;
  name: string;
  phone_number: string;
  username: string;
  winning_commission_percentage: number;
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

export type MasterAgentDepositAgent = {
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
  last_logined: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  balance: string;
};

export type MasterAgentDepositItem = {
  id: number;
  agent_id: number;
  amount: number;
  action_by: MasterAgentDepositActionBy;
  date_time: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  agent: MasterAgentDepositAgent;
};

export type MasterAgentDepositMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type MasterAgentDepositResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MasterAgentDepositItem[];
  meta: MasterAgentDepositMeta;
};

export const masterAgentDepositApiSlice = masterAppApi.injectEndpoints({
  endpoints: (build) => ({
    getMasterAgentDepositLists: build.query<
      MasterAgentDepositResponse,
      { page?: number; perPage?: number; search?: string }
    >({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE, search } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        if (search) params.set("search", search);
        return `agents/deposit-lists?${params.toString()}`;
      },
      transformResponse: (response: MasterAgentDepositResponse) => response,
      providesTags: () => [{ type: "masterAgentDeposits" }],
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetMasterAgentDepositListsQuery } = masterAgentDepositApiSlice;
