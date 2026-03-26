import { appApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type GameItem = {
  id: number;
  name: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type GameMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type GameResponse = {
  response: {
    status: string;
    message: string;
  };
  data: GameItem[];
  meta: GameMeta;
};

export const gameApiSlice = appApi.injectEndpoints({
  endpoints: (build) => ({
    getGames: build.query<GameResponse, { page?: number; perPage?: number }>({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        return `games/all?${params.toString()}`;
      },
      transformResponse: (response: GameResponse) => response,
      providesTags: () => [{ type: "games" }],
    }),
    toggleGameStatus: build.mutation<GameResponse, { id: number; deactivate: boolean }>({
      query: ({ id, deactivate }) => ({
        url: `games/${id}/toggle-status`,
        method: "PATCH",
        body: { deactivate },
      }),
      invalidatesTags: () => [{ type: "games" }],
    }),
  }),
});

export const { useGetGamesQuery, useToggleGameStatusMutation } = gameApiSlice;
