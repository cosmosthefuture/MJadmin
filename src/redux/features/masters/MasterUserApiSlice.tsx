import { masterAppApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type MasterUserItem = {
  id: number;
  identification_code: string;
  name: string;
  username: string;
  phone_number: string;
  email?: string;
  agent_code: string;
  status: string;
  is_verified: boolean;
  last_logined: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  balance: string;
};

export type MasterUserMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type MasterUserListResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MasterUserItem[];
  meta: MasterUserMeta;
};

export type MasterUserDetailResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MasterUserItem;
};

export type MasterCreateUserPayload = {
  name: string;
  email?: string;
  phone_number: string;
  username: string;
};

export type MasterUpdateUserPayload = {
  id: number;
  name: string;
  email?: string;
  phone_number: string;
  username: string;
};

export type MasterVerifyUserPayload = {
  id: number;
  password?: string;
  password_confirmation?: string;
};

export type MasterResetPasswordPayload = {
  id: number;
  password?: string;
  password_confirmation?: string;
};

export type MasterAddMoneyPayload = {
  user_id: number;
  amount: string;
};

export type MasterWithdrawMoneyPayload = {
  user_id: number;
  amount: string;
};

export const masterUserApiSlice = masterAppApi.injectEndpoints({
  endpoints: (build) => ({
    getMasterUsers: build.query<
      MasterUserListResponse,
      { page?: number; perPage?: number; search?: string }
    >({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE, search } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        if (search) params.set("search", search);
        return `users/all?${params.toString()}`;
      },
      transformResponse: (response: MasterUserListResponse) => response,
      providesTags: () => [{ type: "masterUsers" }],
    }),
    getMasterUserById: build.query<MasterUserItem, number>({
      query: (id) => `users/${id}`,
      transformResponse: (response: MasterUserDetailResponse) => response.data,
      providesTags: (_result, _error, id) => [{ type: "masterUserById", id }],
    }),
    createMasterUser: build.mutation<MasterUserDetailResponse, MasterCreateUserPayload>({
      query: (body) => ({
        url: "users",
        method: "POST",
        body,
      }),
      invalidatesTags: () => [{ type: "masterUsers" }],
    }),
    updateMasterUser: build.mutation<MasterUserDetailResponse, MasterUpdateUserPayload>({
      query: ({ id, ...body }) => ({
        url: `users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "masterUsers" },
        { type: "masterUserById", id },
      ],
    }),
    toggleMasterUserStatus: build.mutation<
      MasterUserDetailResponse,
      { id: number; deactivate: boolean }
    >({
      query: ({ id, deactivate }) => ({
        url: `users/${id}/toggle-status`,
        method: "PATCH",
        body: { deactivate },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "masterUsers" },
        { type: "masterUserById", id },
      ],
    }),
    verifyMasterUser: build.mutation<MasterUserDetailResponse, MasterVerifyUserPayload>({
      query: ({ id, password, password_confirmation }) => ({
        url: `users/${id}/verify`,
        method: "PUT",
        body: {
          ...(password ? { password } : {}),
          ...(password_confirmation ? { password_confirmation } : {}),
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "masterUsers" },
        { type: "masterUserById", id },
      ],
    }),
    resetMasterUserPassword: build.mutation<MasterUserDetailResponse, MasterResetPasswordPayload>({
      query: ({ id, password, password_confirmation }) => ({
        url: `users/${id}/reset-password`,
        method: "PUT",
        body: { password, password_confirmation },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "masterUsers" },
        { type: "masterUserById", id },
      ],
    }),
    addMoneyToMasterUser: build.mutation<MasterUserDetailResponse, MasterAddMoneyPayload>({
      query: (body) => ({
        url: "users/add-money",
        method: "POST",
        body,
      }),
      invalidatesTags: () => [{ type: "masterUsers" }],
    }),
    withdrawMoneyFromMasterUser: build.mutation<
      MasterUserDetailResponse,
      MasterWithdrawMoneyPayload
    >({
      query: (body) => ({
        url: "users/withdraw-money",
        method: "POST",
        body,
      }),
      invalidatesTags: () => [{ type: "masterUsers" }],
    }),
  }),
});

export const {
  useGetMasterUsersQuery,
  useGetMasterUserByIdQuery,
  useCreateMasterUserMutation,
  useUpdateMasterUserMutation,
  useToggleMasterUserStatusMutation,
  useVerifyMasterUserMutation,
  useResetMasterUserPasswordMutation,
  useAddMoneyToMasterUserMutation,
  useWithdrawMoneyFromMasterUserMutation,
} = masterUserApiSlice;
