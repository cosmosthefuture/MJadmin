import { DEFAULT_PER_PAGE } from "@/lib/constants";
import { masterAppApi } from "@/redux/services/appApi";

export type MasterDailyCashbookRecordItem = {
  id: number;
  master_id: number;
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

export type MasterDailyCashbookRecordMeta = {
  total: number;
  per_page: string;
  current_page: string;
  total_pages: number;
};

export type MasterDailyCashbookRecordResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MasterDailyCashbookRecordItem[];
  meta: MasterDailyCashbookRecordMeta;
};

export type GetMasterDailyCashbookRecordParams = {
  page?: number;
  per_page?: number;
  from?: string;
  to?: string;
};

export const masterDailyCashbookRecordApiSlice = masterAppApi.injectEndpoints({
  endpoints: (build) => ({
    getMasterDailyCashbookRecords: build.query<
      MasterDailyCashbookRecordResponse,
      GetMasterDailyCashbookRecordParams
    >({
      query: ({ page = 1, per_page = DEFAULT_PER_PAGE, from, to } = {}) => {
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
      transformResponse: (response: MasterDailyCashbookRecordResponse) => response,
      providesTags: () => [{ type: "masterDailyCashbookRecords" }],
    }),
  }),
});

export const { useGetMasterDailyCashbookRecordsQuery } = masterDailyCashbookRecordApiSlice;
