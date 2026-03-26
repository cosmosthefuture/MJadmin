import { appApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type SpinWheelBetHistoryItem = {
  id: number;
  created_at: string;
  user_name: string;
  user_id: number;
  game: string;
  bet_amount: number;
  winning_amount: number;
  status: "won" | "lost" | string;
  room: string;
  round: number;
};

export type SpinWheelBetHistoryMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type SpinWheelBetHistoryResponse = {
  response: {
    status: string;
    message: string;
  };
  data: SpinWheelBetHistoryItem[];
  meta: SpinWheelBetHistoryMeta;
};

export type CoinFlipBetHistoryItem = {
  id: number;
  created_at: string;
  user_name: string;
  user_id: number;
  game: string;
  bet_side: string;
  bet_amount: number;
  winning_amount: number;
  status: "won" | "lost" | string;
  room: string;
  round: number;
};

export type CoinFlipBetHistoryMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type CoinFlipBetHistoryResponse = {
  response: {
    status: string;
    message: string;
  };
  data: CoinFlipBetHistoryItem[];
  meta: CoinFlipBetHistoryMeta;
};

export const betHistoryApiSlice = appApi.injectEndpoints({
  endpoints: (build) => ({
    getSpinWheelBetHistories: build.query<
      SpinWheelBetHistoryResponse,
      { page?: number; perPage?: number; search?: string }
    >({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE, search } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        if (search) params.set("search", search);
        return `spin-wheel/bet-histories?${params.toString()}`;
      },
      transformResponse: (response: SpinWheelBetHistoryResponse) => response,
      providesTags: () => [{ type: "spinWheelBetHistories" }],
      keepUnusedDataFor: 0, // Do not keep cached data when not in use
    }),

    getCoinFlipBetHistories: build.query<
      CoinFlipBetHistoryResponse,
      { page?: number; perPage?: number; search?: string }
    >({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE, search } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        if (search) params.set("search", search);
        return `coin-flip/bet-histories?${params.toString()}`;
      },
      transformResponse: (response: CoinFlipBetHistoryResponse) => response,
      providesTags: () => [{ type: "coinFlipBetHistories" }],
      keepUnusedDataFor: 0, // Do not keep cached data when not in use
    }),
  }),
});

export const { useGetSpinWheelBetHistoriesQuery, useGetCoinFlipBetHistoriesQuery } =
  betHistoryApiSlice;
