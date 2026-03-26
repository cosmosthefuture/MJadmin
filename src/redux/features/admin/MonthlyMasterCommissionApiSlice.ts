import { appApi } from "../../services/appApi";

export type MonthlyMasterCommissionItem = {
  id: number;
  name: string;
  total_commission: number;
};

export type MonthlyMasterCommissionResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MonthlyMasterCommissionItem[];
  meta: {
    total: number;
    per_page: string;
    current_page: number;
    total_pages: number;
  };
};

export const monthlyMasterCommissionApiSlice = appApi.injectEndpoints({
  endpoints: (build) => ({
    getMonthlyMasterCommission: build.query<
      MonthlyMasterCommissionResponse,
      { page?: number; perPage?: number; month: string }
    >({
      query: ({ page = 1, perPage = 20, month }) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        params.set("month", month);
        return `reports/monthly-master-commission?${params.toString()}`;
      },
      transformResponse: (response: MonthlyMasterCommissionResponse) => response,
      providesTags: () => [{ type: "monthlyMasterCommission" }],
      keepUnusedDataFor: 60,
    }),
  }),
});

export const { useGetMonthlyMasterCommissionQuery } = monthlyMasterCommissionApiSlice;
