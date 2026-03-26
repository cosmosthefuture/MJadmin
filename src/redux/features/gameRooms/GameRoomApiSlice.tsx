import { appApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type GameRoomUser = {
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

export type GameRoomGame = {
  id: number;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type GameRoomRule = {
  id: number;
  rule_name: string;
  max_bet_amount: number;
  min_bet_amount: number;
  time_per_round: number;
  user_limit: number;
  status: string;
  game_id: number;
  created_by: number;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type GameRoomItem = {
  id: number;
  game_rule_id: number;
  game_id: number;
  room_name: string;
  room_code: string;
  status: string;
  created_by: GameRoomUser | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  game: GameRoomGame;
  game_rule: GameRoomRule;
};

export type GameRoomMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type GameRoomResponse = {
  response: {
    status: string;
    message: string;
  };
  data: GameRoomItem[];
  meta: GameRoomMeta;
};

export type CreateGameRoomRequest = {
  room_name: string;
  room_code: string;
  game_id: number;
  game_rule_id: number;
};

export type UpdateGameRoomRequest = CreateGameRoomRequest & { id: number };

export type ToggleGameRoomRequest = {
  id: number;
  deactivate: boolean;
};

export const gameRoomApiSlice = appApi.injectEndpoints({
  endpoints: (build) => ({
    getGameRooms: build.query<
      GameRoomResponse,
      { page?: number; perPage?: number; search?: string }
    >({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE, search } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        if (search) params.set("search", search);
        return `game-rooms/all?${params.toString()}`;
      },
      transformResponse: (response: GameRoomResponse) => response,
      providesTags: () => [{ type: "gameRooms" }],
    }),
    createGameRoom: build.mutation<GameRoomResponse, CreateGameRoomRequest>({
      query: (body) => ({
        url: "game-rooms",
        method: "POST",
        body,
      }),
      invalidatesTags: () => [{ type: "gameRooms" }],
    }),
    updateGameRoom: build.mutation<GameRoomResponse, UpdateGameRoomRequest>({
      query: ({ id, ...body }) => ({
        url: `game-rooms/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: () => [{ type: "gameRooms" }],
    }),
    toggleGameRoomStatus: build.mutation<GameRoomResponse, ToggleGameRoomRequest>({
      query: ({ id, deactivate }) => ({
        url: `game-rooms/${id}/toggle-status`,
        method: "PATCH",
        body: { deactivate },
      }),
      invalidatesTags: () => [{ type: "gameRooms" }],
    }),
  }),
});

export const {
  useGetGameRoomsQuery,
  useCreateGameRoomMutation,
  useUpdateGameRoomMutation,
  useToggleGameRoomStatusMutation,
} = gameRoomApiSlice;
