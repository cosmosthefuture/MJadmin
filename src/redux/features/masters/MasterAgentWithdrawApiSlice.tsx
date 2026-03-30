import { masterAppApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type MasterAgentWithdrawActionBy = {
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

export type MasterAgentWithdrawAgent = {
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

export type MasterAgentWithdrawItem = {
  id: number;
  agent_id: number;
  amount: number;
  action_by: MasterAgentWithdrawActionBy;
  date_time: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  agent: MasterAgentWithdrawAgent;
};

export type MasterAgentWithdrawMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type MasterAgentWithdrawResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MasterAgentWithdrawItem[];
  meta: MasterAgentWithdrawMeta;
};

export const masterAgentWithdrawApiSlice = masterAppApi.injectEndpoints({
  endpoints: (build) => ({
    getMasterAgentWithdrawLists: build.query<
      MasterAgentWithdrawResponse,
      { page?: number; perPage?: number; search?: string }
    >({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE, search } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        if (search) params.set("search", search);
        return `agents/withdraw-lists?${params.toString()}`;
      },
      transformResponse: (response: MasterAgentWithdrawResponse) => response,
      providesTags: () => [{ type: "masterAgentWithdraws" }],
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetMasterAgentWithdrawListsQuery } = masterAgentWithdrawApiSlice;
