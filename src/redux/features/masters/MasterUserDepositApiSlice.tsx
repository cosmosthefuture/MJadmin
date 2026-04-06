import { masterAppApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type MasterUserDepositActionByMaster = {
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

export type MasterUserDepositActionByAgent = {
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

export type MasterUserDepositUser = {
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

export type MasterUserDepositItem = {
  id: number;
  user_id: number;
  amount: number;
  action_by_agent: MasterUserDepositActionByAgent | null;
  action_by_master: MasterUserDepositActionByMaster | null;
  date_time: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: MasterUserDepositUser;
};

export type MasterUserDepositMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type MasterUserDepositResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MasterUserDepositItem[];
  meta: MasterUserDepositMeta;
};

export const masterUserDepositApiSlice = masterAppApi.injectEndpoints({
  endpoints: (build) => ({
    getMasterUserDepositLists: build.query<
      MasterUserDepositResponse,
      { page?: number; perPage?: number; search?: string }
    >({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE, search } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        if (search) params.set("search", search);
        return `users/deposit-lists?${params.toString()}`;
      },
      transformResponse: (response: MasterUserDepositResponse) => response,
      providesTags: () => [{ type: "masterUserDeposits" }],
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetMasterUserDepositListsQuery } = masterUserDepositApiSlice;
