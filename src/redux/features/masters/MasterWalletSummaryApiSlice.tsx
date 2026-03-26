import { masterAppApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type MasterDailyWalletSummaryItem = {
  id: number;
  master_id: number;
  date: string;
  opening_balance: number;
  total_in: number;
  total_out: number;
  closing_balance: number;
  created_at: string;
  updated_at: string;
};

export type MasterDailyWalletSummaryMeta = {
  total: number;
  per_page: string;
  current_page: string;
  total_pages: number;
};

export type MasterDailyWalletSummaryResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MasterDailyWalletSummaryItem[];
  meta: MasterDailyWalletSummaryMeta;
};

export const masterWalletSummaryApiSlice = masterAppApi.injectEndpoints({
  endpoints: (build) => ({
    getMasterDailyWalletSummary: build.query<
      MasterDailyWalletSummaryResponse,
      { page?: number; per_page?: number }
    >({
      query: ({ page = 1, per_page = DEFAULT_PER_PAGE } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", per_page.toString());
        return `daily-wallet-summary?${params.toString()}`;
      },
      transformResponse: (response: MasterDailyWalletSummaryResponse) => response,
      providesTags: () => [{ type: "masterDailyWalletSummary" }],
    }),
  }),
});

export const { useGetMasterDailyWalletSummaryQuery } = masterWalletSummaryApiSlice;
