import { appApi } from "../../services/appApi";

export type MonthlyAgentCommissionItem = {
  id: number;
  name: string;
  total_commission: number;
};

export type MonthlyAgentCommissionResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MonthlyAgentCommissionItem[];
  meta: {
    total: number;
    per_page: string;
    current_page: number;
    total_pages: number;
  };
};

export const monthlyAgentCommissionApiSlice = appApi.injectEndpoints({
  endpoints: (build) => ({
    getMonthlyAgentCommission: build.query<
      MonthlyAgentCommissionResponse,
      { page?: number; perPage?: number; month: string }
    >({
      query: ({ page = 1, perPage = 20, month }) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        params.set("month", month);
        return `reports/monthly-agent-commission?${params.toString()}`;
      },
      transformResponse: (response: MonthlyAgentCommissionResponse) => response,
      providesTags: () => [{ type: "monthlyAgentCommission" }],
      keepUnusedDataFor: 60,
    }),
  }),
});

export const { useGetMonthlyAgentCommissionQuery } = monthlyAgentCommissionApiSlice;
