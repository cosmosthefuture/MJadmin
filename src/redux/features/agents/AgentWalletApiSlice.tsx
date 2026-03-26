import { agentAppApi } from "@/redux/services/appApi";

export type AgentWalletBalanceResponse = {
  response: {
    status: string;
    message: string;
  };
  data: {
    "wallet-balance": string;
  };
};

export const agentWalletApiSlice = agentAppApi.injectEndpoints({
  endpoints: (build) => ({
    getAgentWalletBalance: build.query<AgentWalletBalanceResponse, void>({
      query: () => ({
        url: "/wallet-balance",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAgentWalletBalanceQuery } = agentWalletApiSlice;
