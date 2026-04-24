import { appApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type GameRuleFeeType = "room" | "registration" | "winning_commission";
export type GameRulePayerType = "each_player" | "winner";

export type GameRuleFee = {
  id?: number;
  mah_jong_game_rule_id?: number;
  fee_type: GameRuleFeeType;
  amount: number;
  payer_type: GameRulePayerType;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};

export type GameRuleUser = {
  id: number;
  name: string;
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
  // backend field name
  round_qty_per_match?: number;
  // legacy/alternate field name (kept for compatibility)
  match_qty_per_round?: number;
  max_player: number;
  bet_amount: number;
  game_id: number;
  status?: "active" | "inactive";
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  created_by?: GameRuleUser | null;
  updated_by?: GameRuleUser | null;
  game?: GameRuleGame | null;
  fees?: GameRuleFee[];
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
  meta?: GameRuleMeta;
};

export type CreateGameRuleRequest = {
  rule_name: string;
  round_qty_per_match: number;
  max_player: number;
  bet_amount: number;
  fees: GameRuleFee[];
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
        return `mah-jong-game-rules/all?${params.toString()}`;
      },
      transformResponse: (response: GameRuleResponse) => response,
      providesTags: () => [{ type: "gameRules" }],
    }),
    getGameRule: build.query<SingleGameRuleResponse, { id: number }>({
      query: ({ id }) => `mah-jong-game-rules/${id}`,
      transformResponse: (response: SingleGameRuleResponse) => response,
      providesTags: (_result, _error, { id }) => [{ type: "gameRules", id }],
    }),
    toggleGameRuleStatus: build.mutation<
      SingleGameRuleResponse,
      { id: number; deactivate: boolean }
    >({
      query: ({ id, deactivate }) => ({
        url: `mah-jong-game-rules/${id}/toggle-status`,
        method: "PATCH",
        body: { deactivate },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "gameRules" },
        { type: "gameRules", id },
      ],
    }),
    createGameRule: build.mutation<SingleGameRuleResponse, CreateGameRuleRequest>({
      query: (body) => ({
        url: "mah-jong-game-rules",
        method: "POST",
        body,
      }),
      invalidatesTags: () => [{ type: "gameRules" }],
    }),
    updateGameRule: build.mutation<SingleGameRuleResponse, CreateGameRuleRequest & { id: number }>(
      {
        query: ({ id, ...body }) => ({
          url: `mah-jong-game-rules/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: "gameRules" },
          { type: "gameRules", id },
        ],
      }
    ),
  }),
});

export const {
  useGetGameRulesQuery,
  useGetGameRuleQuery,
  useToggleGameRuleStatusMutation,
  useCreateGameRuleMutation,
  useUpdateGameRuleMutation,
} = gameRuleApiSlice;
