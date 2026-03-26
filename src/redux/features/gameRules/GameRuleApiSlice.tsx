import { appApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type GameRuleUser = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  username: string;
  status: string;
  force_reset_password: boolean;
  last_logined: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type GameRuleGame = {
  id: number;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type GameRuleItem = {
  id: number;
  rule_name: string;
  max_bet_amount: number;
  min_bet_amount: number;
  time_per_round: number;
  user_limit: number;
  status: "active" | "inactive";
  game_id: number;
  created_by: GameRuleUser | null;
  updated_by: GameRuleUser | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  game: GameRuleGame;
};

export type GameRuleMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type GameRuleResponse = {
  response: {
    status: string;
    message: string;
  };
  data: GameRuleItem[];
  meta: GameRuleMeta;
};

export type CreateGameRuleRequest = {
  rule_name: string;
  max_bet_amount: number;
  min_bet_amount: number;
  time_per_round: number;
  game_id: number;
  user_limit: number;
};

export type SingleGameRuleResponse = {
  response: {
    status: string;
    message: string;
  };
  data: GameRuleItem;
};

export const gameRuleApiSlice = appApi.injectEndpoints({
  endpoints: (build) => ({
    getGameRules: build.query<GameRuleResponse, { page?: number; perPage?: number }>({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        return `game-rules/all?${params.toString()}`;
      },
      transformResponse: (response: GameRuleResponse) => response,
      providesTags: () => [{ type: "gameRules" }],
    }),
    getGameRule: build.query<SingleGameRuleResponse, { id: number }>({
      query: ({ id }) => `game-rules/${id}`,
      transformResponse: (response: SingleGameRuleResponse) => response,
      providesTags: (_result, _error, { id }) => [{ type: "gameRules", id }],
    }),
    toggleGameRuleStatus: build.mutation<GameRuleResponse, { id: number; deactivate: boolean }>({
      query: ({ id, deactivate }) => ({
        url: `game-rules/${id}/toggle-status`,
        method: "PATCH",
        body: { deactivate },
      }),
      invalidatesTags: () => [{ type: "gameRules" }],
    }),
    createGameRule: build.mutation<GameRuleResponse, CreateGameRuleRequest>({
      query: (body) => ({
        url: "game-rules",
        method: "POST",
        body,
      }),
      invalidatesTags: () => [{ type: "gameRules" }],
    }),
    updateGameRule: build.mutation<GameRuleResponse, CreateGameRuleRequest & { id: number }>({
      query: ({ id, ...body }) => ({
        url: `game-rules/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "gameRules" },
        { type: "gameRules", id },
      ],
    }),
  }),
});

export const {
  useGetGameRulesQuery,
  useGetGameRuleQuery,
  useToggleGameRuleStatusMutation,
  useCreateGameRuleMutation,
  useUpdateGameRuleMutation,
} = gameRuleApiSlice;
