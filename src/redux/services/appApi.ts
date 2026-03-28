// src/redux/api/appApi.ts

import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "@/redux/store";
import { clearToken } from "../features/AuthSlice";
import { removeCookie } from "@/utils/cookie";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");

const baseQuery = fetchBaseQuery({
  baseUrl: `${apiBaseUrl}/admins`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("Accept", "application/json");
    return headers;
  },
});

const masterBaseQuery = fetchBaseQuery({
  baseUrl: `${apiBaseUrl}/masters`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("Accept", "application/json");
    return headers;
  },
});

const agentBaseQuery = fetchBaseQuery({
  baseUrl: `${apiBaseUrl}/agents`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("Accept", "application/json");
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    api.dispatch(clearToken());
    await removeCookie("userInfo");
  }

  if (result.data) {
    const data = result.data as { message?: string };
    if (data.message === "Unauthenticated.") {
      await removeCookie("userInfo");
      api.dispatch(clearToken());
    }
  }

  return result;
};

const agentBaseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await agentBaseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    api.dispatch(clearToken());
    await removeCookie("userInfo");
  }

  if (result.data) {
    const data = result.data as { message?: string };
    if (data.message === "Unauthenticated.") {
      await removeCookie("userInfo");
      api.dispatch(clearToken());
    }
  }

  return result;
};

const masterBaseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await masterBaseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    api.dispatch(clearToken());
    await removeCookie("userInfo");
  }

  if (result.data) {
    const data = result.data as { message?: string };
    if (data.message === "Unauthenticated.") {
      await removeCookie("userInfo");
      api.dispatch(clearToken());
    }
  }

  return result;
};

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "adminApi",
    "adminAgents",
    "userApi",
    "rolesApi",
    "permissionsApi",
    "userById",
    "optionsApi",
    "serviceApi",
    "professionalApi",
    "serviceWithOutPaginationApi",
    "questionApi",
    "workflowApi",
    "serviceRequestByAdminApi",
    "serviceRequestByProfessionalApi",
    "adminProfileApi",
    "professioanlProfileApi",
    "paymentMethods",
    "depositRequests",
    "withdrawRequests",
    "agentWithdrawRequests",
    "moneyTransferRecords",
    "games",
    "gameRules",
    "gameRooms",
    "spinWheelBetHistories",
    "coinFlipBetHistories",
    "mastersApi",
    "adminDepositNotifications",
    "adminWithdrawNotifications",
    "globalCommissionSettings",
    "adminMasterWithdrawRequests",
    "masterNotifications",
    "houseCutReports",
    "houseCutDailyLists",
    "depositReports",
    "depositDailyLists",
    "moneyTransferReports",
    "moneyTransferDailyLists",
    "profitReports",
    "profitDailyLists",
    "userGameHistoryLists",
    "monthlyMasterCommission",
    "monthlyAgentCommission",
  ],
  endpoints: () => ({}), // 👈 leave empty for now
});

export const masterAppApi = createApi({
  reducerPath: "masterApi",
  baseQuery: masterBaseQueryWithReauth,
  tagTypes: [
    "mastersApi",
    "agentsApi",
    "masterWithdrawHistory",
    "masterPaymentMethods",
    "masterWalletRecords",
    "masterDailyWalletSummary",
    "masterDailyCashbookRecords",
    "masterNotifications",
  ],
  endpoints: () => ({}),
});

export const agentAppApi = createApi({
  reducerPath: "agentApi",
  baseQuery: agentBaseQueryWithReauth,
  tagTypes: [
    "agentPaymentMethods",
    "agentWithdrawHistory",
    "agentDailyCashbookRecords",
    "agentNotifications",
  ],
  endpoints: () => ({}),
});

// Export hooks for usage in functional components
