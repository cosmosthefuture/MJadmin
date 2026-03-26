import { appApi } from "@/redux/services/appApi";

export type UserGameHistoryItem = {
  id: number;
  game_type: string;
  bet_amount: number;
  winning_amount: number;
  status: string;
  room: string;
  round: number;
  created_at: string;
};

export type UserGameHistoryData = {
  total_bet_amount: number;
  total_winning_amount: number;
  histories: UserGameHistoryItem[];
};

export type UserGameHistoryMeta = {
  total: number;
  per_page: string;
  current_page: number;
  total_pages: number;
};

export type UserGameHistoryResponse = {
  response: {
    status: string;
    message: string;
  };
  data: UserGameHistoryData;
  meta: UserGameHistoryMeta;
};

export const userApiSlice = appApi.injectEndpoints({
  endpoints: (build) => ({
    getUserGameHistoryLists: build.query<
      UserGameHistoryResponse,
      { page?: number; perPage?: number; userId: number }
    >({
      query: ({ page = 1, perPage = 10, userId }) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        params.set("user_id", userId.toString());
        return `reports/user-game-history/lists?${params.toString()}`;
      },
      transformResponse: (response: UserGameHistoryResponse) => response,
      providesTags: () => [{ type: "userGameHistoryLists" }],
      keepUnusedDataFor: 60,
    }),
  }),
});

export const { useGetUserGameHistoryListsQuery } = userApiSlice;
