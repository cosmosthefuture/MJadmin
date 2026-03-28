import { DEFAULT_PER_PAGE } from "@/lib/constants";
import { masterAppApi } from "@/redux/services/appApi";

export type MasterWalletRecordItem = {
  id: number;
  master_id: number;
  date_time: string;
  type: "in" | "out";
  amount: number;
  balance: number;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type MasterWalletRecordMeta = {
  total: number;
  per_page: string;
  current_page: string;
  total_pages: number;
};

export type MasterWalletRecordResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MasterWalletRecordItem[];
  meta: MasterWalletRecordMeta;
};

export type GetMasterWalletRecordParams = {
  page?: number;
  per_page?: number;
};

export const masterWalletRecordApiSlice = masterAppApi.injectEndpoints({
  endpoints: (build) => ({
    getMasterWalletRecords: build.query<MasterWalletRecordResponse, GetMasterWalletRecordParams>({
      query: ({ page = 1, per_page = DEFAULT_PER_PAGE } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", per_page.toString());
        return `wallet-records?${params.toString()}`;
      },
      transformResponse: (response: MasterWalletRecordResponse) => response,
      providesTags: () => [{ type: "masterWalletRecords" }],
    }),
  }),
});

export const { useGetMasterWalletRecordsQuery } = masterWalletRecordApiSlice;
