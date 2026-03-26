import { masterAppApi } from "@/redux/services/appApi";

export type MasterMonthlyIncentiveAgent = {
  agent_id: number;
  agent_name: string;
  total_deposit_amount: number;
  total_agent_incentive_amount: number;
  total_master_incentive_amount: number;
};

export type MasterMonthlyIncentiveMonthTotal = {
  total_deposit_amount: number;
  total_agent_incentive_amount: number;
  total_master_incentive_amount: number;
};

export type MasterMonthlyIncentiveItem = {
  month: string;
  agents: MasterMonthlyIncentiveAgent[];
  month_total: MasterMonthlyIncentiveMonthTotal;
};

export type MasterMonthlyIncentiveMeta = {
  total: number;
  per_page: string;
  current_page: string;
  total_pages: number;
};

export type MasterMonthlyIncentiveResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MasterMonthlyIncentiveItem[];
  meta: MasterMonthlyIncentiveMeta;
};

export type GetMasterMonthlyIncentiveParams = {
  page: number;
  per_page: number;
};

export const masterMonthlyIncentiveReportApiSlice = masterAppApi.injectEndpoints({
  endpoints: (build) => ({
    getMasterMonthlyIncentiveReport: build.query<
      MasterMonthlyIncentiveResponse,
      GetMasterMonthlyIncentiveParams
    >({
      query: ({ page, per_page }) => ({
        url: `/monthly-incentive-report?page=${page}&per_page=${per_page}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetMasterMonthlyIncentiveReportQuery } =
  masterMonthlyIncentiveReportApiSlice;
