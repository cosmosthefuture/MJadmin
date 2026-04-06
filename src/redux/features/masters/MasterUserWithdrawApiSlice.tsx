import { masterAppApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type MasterUserWithdrawActionByMaster = {
  id: number;
  name: string;
  phone_number: string;
  username: string;
  master_code: string;
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

export type MasterUserWithdrawActionByAgent = {
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

export type MasterUserWithdrawUser = {
  id: number;
  master_id: number | null;
  agent_id: number | null;
  identification_code: string;
  name: string;
  username: string;
  phone_number: string;
  email: string;
  status: string;
  is_verified: boolean;
  last_logined: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  balance: string;
};

export type MasterUserWithdrawItem = {
  id: number;
  user_id: number;
  amount: number;
  action_by_agent: MasterUserWithdrawActionByAgent | null;
  action_by_master: MasterUserWithdrawActionByMaster | null;
  date_time: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: MasterUserWithdrawUser;
};

export type MasterUserWithdrawMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type MasterUserWithdrawResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MasterUserWithdrawItem[];
  meta: MasterUserWithdrawMeta;
};

export const masterUserWithdrawApiSlice = masterAppApi.injectEndpoints({
  endpoints: (build) => ({
    getMasterUserWithdrawLists: build.query<
      MasterUserWithdrawResponse,
      { page?: number; perPage?: number; search?: string }
    >({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE, search } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        if (search) params.set("search", search);
        return `users/withdraw-lists?${params.toString()}`;
      },
      transformResponse: (response: MasterUserWithdrawResponse) => response,
      providesTags: () => [{ type: "masterUserWithdraws" }],
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetMasterUserWithdrawListsQuery } = masterUserWithdrawApiSlice;
