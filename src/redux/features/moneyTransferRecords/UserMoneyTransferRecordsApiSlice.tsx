import { appApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type MoneyTransferUser = {
  id: number;
  name: string;
  username: string | null;
  phone_number: string;
  email: string | null;
  agent_code: string | null;
  status: string;
  is_verified: boolean;
  last_logined: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  balance: string;
};

export type MoneyTransferRecordItem = {
  id: number;
  sender_id: number;
  recipient_id: number;
  amount: number;
  house_cut_percentage: number;
  house_cut_amount: number;
  status: string;
  note: string | null;
  response_note: string | null;
  created_at: string;
  updated_at: string;
  sender: MoneyTransferUser;
  recipient: MoneyTransferUser;
};

export type MoneyTransferRecordsMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type MoneyTransferRecordsResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MoneyTransferRecordItem[];
  meta: MoneyTransferRecordsMeta;
};

export const userMoneyTransferRecordsApiSlice = appApi.injectEndpoints({
  endpoints: (build) => ({
    getUserMoneyTransferRecords: build.query<
      MoneyTransferRecordsResponse,
      { page?: number; perPage?: number }
    >({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        return `user-money-transfer-records/all?${params.toString()}`;
      },
      transformResponse: (response: MoneyTransferRecordsResponse) => response,
      providesTags: () => [{ type: "moneyTransferRecords" }],
      keepUnusedDataFor: 0, // Do not keep cached data when not in use
    }),
  }),
});

export const { useGetUserMoneyTransferRecordsQuery } = userMoneyTransferRecordsApiSlice;
