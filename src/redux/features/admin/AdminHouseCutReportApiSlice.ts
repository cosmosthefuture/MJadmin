import { appApi } from "@/redux/services/appApi";

export type HouseCutReportSeriesItem = {
  name: string;
  data: number[];
};

export type HouseCutReportData = {
  categories: string[];
  series: HouseCutReportSeriesItem[];
};

export type HouseCutReportResponse = {
  response: {
    status: string;
    message: string;
  };
  data: HouseCutReportData;
};

export type HouseCutDailyItem = {
  id: number;
  report_date: string;
  spin_wheel_house_cut: number;
  coin_flip_house_cut: number;
  total_house_cut: number;
  created_at: string;
  updated_at: string;
};

export type HouseCutDailyMeta = {
  total: number;
  per_page: string;
  current_page: string;
  total_pages: number;
};

export type HouseCutDailyResponse = {
  response: {
    status: string;
    message: string;
  };
  data: HouseCutDailyItem[];
  meta: HouseCutDailyMeta;
};

export type HouseCutReportType = "daily" | "monthly" | "quarterly";

export type DepositReportSeriesItem = {
  name: string;
  data: number[];
};

export type DepositReportData = {
  categories: string[];
  series: DepositReportSeriesItem[];
};

export type DepositReportResponse = {
  response: {
    status: string;
    message: string;
  };
  data: DepositReportData;
};

export type DepositDailyItem = {
  id: number;
  report_date: string;
  request_deposit: number;
  manual_deposit: number;
  total_deposit: number;
  created_at: string;
  updated_at: string;
};

export type DepositDailyMeta = {
  total: number;
  per_page: string;
  current_page: string;
  total_pages: number;
};

export type DepositDailyResponse = {
  response: {
    status: string;
    message: string;
  };
  data: DepositDailyItem[];
  meta: DepositDailyMeta;
};

export type DepositReportType = "daily" | "monthly" | "quarterly";

export type MoneyTransferReportSeriesItem = {
  name: string;
  data: number[];
};

export type MoneyTransferReportData = {
  categories: string[];
  series: MoneyTransferReportSeriesItem[];
};

export type MoneyTransferReportResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MoneyTransferReportData;
};

export type MoneyTransferDailyItem = {
  id: number;
  report_date: string;
  request_transfer: number;
  manual_transfer: number;
  total_transfer: number;
  total_commission_amount: number;
  created_at: string;
  updated_at: string;
};

export type MoneyTransferDailyMeta = {
  total: number;
  per_page: string;
  current_page: string;
  total_pages: number;
};

export type MoneyTransferDailyResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MoneyTransferDailyItem[];
  meta: MoneyTransferDailyMeta;
};

export type ProfitReportSeriesItem = {
  name: string;
  data: number[];
};

export type ProfitReportData = {
  categories: string[];
  series: ProfitReportSeriesItem[];
};

export type ProfitReportResponse = {
  response: {
    status: string;
    message: string;
  };
  data: ProfitReportData;
};

export type ProfitDailyItem = {
  id: number;
  report_date: string;
  spin_wheel_profit: number;
  coin_flip_profit: number;
  money_transfer_profit: number;
  total_profit: number;
  created_at: string;
  updated_at: string;
};

export type ProfitDailyMeta = {
  total: number;
  per_page: string;
  current_page: string;
  total_pages: number;
};

export type ProfitDailyResponse = {
  response: {
    status: string;
    message: string;
  };
  data: ProfitDailyItem[];
  meta: ProfitDailyMeta;
};

export type MoneyTransferReportType = "daily" | "monthly" | "quarterly";

export type ProfitReportType = "daily" | "monthly" | "quarterly";

export const adminHouseCutReportApiSlice = appApi.injectEndpoints({
  endpoints: (build) => ({
    getHouseCutReport: build.query<HouseCutReportResponse, { type: HouseCutReportType }>({
      query: ({ type }) => {
        const params = new URLSearchParams();
        params.set("type", type);
        return `reports/house-cut?${params.toString()}`;
      },
      transformResponse: (response: HouseCutReportResponse) => response,
      providesTags: () => [{ type: "houseCutReports" }],
      keepUnusedDataFor: 60,
    }),
    getHouseCutDailyLists: build.query<
      HouseCutDailyResponse,
      { page?: number; perPage?: number; startDate?: string; endDate?: string }
    >({
      query: ({ page = 1, perPage = 10, startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        if (startDate) params.set("start_date", startDate);
        if (endDate) params.set("end_date", endDate);
        return `reports/house-cut/daily-lists?${params.toString()}`;
      },
      transformResponse: (response: HouseCutDailyResponse) => response,
      providesTags: () => [{ type: "houseCutDailyLists" }],
      keepUnusedDataFor: 60,
    }),
    getDepositReport: build.query<DepositReportResponse, { type: DepositReportType }>({
      query: ({ type }) => {
        const params = new URLSearchParams();
        params.set("type", type);
        return `reports/deposit?${params.toString()}`;
      },
      transformResponse: (response: DepositReportResponse) => response,
      providesTags: () => [{ type: "depositReports" }],
      keepUnusedDataFor: 60,
    }),
    getDepositDailyLists: build.query<
      DepositDailyResponse,
      { page?: number; perPage?: number; startDate?: string; endDate?: string }
    >({
      query: ({ page = 1, perPage = 10, startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        if (startDate) params.set("start_date", startDate);
        if (endDate) params.set("end_date", endDate);
        return `reports/deposit/daily-lists?${params.toString()}`;
      },
      transformResponse: (response: DepositDailyResponse) => response,
      providesTags: () => [{ type: "depositDailyLists" }],
      keepUnusedDataFor: 60,
    }),
    getMoneyTransferReport: build.query<
      MoneyTransferReportResponse,
      { type: MoneyTransferReportType }
    >({
      query: ({ type }) => {
        const params = new URLSearchParams();
        params.set("type", type);
        return `reports/money-transfer?${params.toString()}`;
      },
      transformResponse: (response: MoneyTransferReportResponse) => response,
      providesTags: () => [{ type: "moneyTransferReports" }],
      keepUnusedDataFor: 60,
    }),
    getMoneyTransferDailyLists: build.query<
      MoneyTransferDailyResponse,
      { page?: number; perPage?: number; startDate?: string; endDate?: string }
    >({
      query: ({ page = 1, perPage = 10, startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        if (startDate) params.set("start_date", startDate);
        if (endDate) params.set("end_date", endDate);
        return `reports/money-transfer/daily-lists?${params.toString()}`;
      },
      transformResponse: (response: MoneyTransferDailyResponse) => response,
      providesTags: () => [{ type: "moneyTransferDailyLists" }],
      keepUnusedDataFor: 60,
    }),
    getProfitReport: build.query<ProfitReportResponse, { type: ProfitReportType }>({
      query: ({ type }) => {
        const params = new URLSearchParams();
        params.set("type", type);
        return `reports/profit?${params.toString()}`;
      },
      transformResponse: (response: ProfitReportResponse) => response,
      providesTags: () => [{ type: "profitReports" }],
      keepUnusedDataFor: 60,
    }),
    getProfitDailyLists: build.query<
      ProfitDailyResponse,
      { page?: number; perPage?: number; startDate?: string; endDate?: string }
    >({
      query: ({ page = 1, perPage = 10, startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        if (startDate) params.set("start_date", startDate);
        if (endDate) params.set("end_date", endDate);
        return `reports/profit/daily-lists?${params.toString()}`;
      },
      transformResponse: (response: ProfitDailyResponse) => response,
      providesTags: () => [{ type: "profitDailyLists" }],
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useGetHouseCutReportQuery,
  useGetHouseCutDailyListsQuery,
  useGetDepositReportQuery,
  useGetDepositDailyListsQuery,
  useGetMoneyTransferReportQuery,
  useGetMoneyTransferDailyListsQuery,
  useGetProfitReportQuery,
  useGetProfitDailyListsQuery,
} = adminHouseCutReportApiSlice;
