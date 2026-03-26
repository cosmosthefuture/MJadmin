import { masterAppApi } from "@/redux/services/appApi";

export type MasterWalletBalanceResponse = {
  response: {
    status: string;
    message: string;
  };
  data: {
    "wallet-balance": string;
  };
};

export const masterWalletApiSlice = masterAppApi.injectEndpoints({
  endpoints: (build) => ({
    getMasterWalletBalance: build.query<MasterWalletBalanceResponse, void>({
      query: () => ({
        url: "/wallet-balance",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetMasterWalletBalanceQuery } = masterWalletApiSlice;
