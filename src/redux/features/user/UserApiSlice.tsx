import {
  UserModel,
  StepOneResT,
  StepOneT,
  StepTwoT,
  StepThreeT,
  Tuser,
  UserDetailT,
} from "@/types/types";
import { appApi } from "@/redux/services/appApi";

type userDetailResT = {
  data: UserDetailT;
};

type UserResponse = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone_number: string;
  is_verified: boolean;
  status: string;
  created_at: string;
  updated_at: string;
};

type CreateUserResponse = {
  response: {
    status: string;
    message: string;
  };
  data: UserResponse;
};
export const usersApiSlice = appApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query<UserModel, { page: number; perPage?: number; search?: string }>({
      query: ({ page, perPage = 10, search }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: perPage.toString(),
        });

        if (search) {
          params.append("search", search);
        }

        return `users/all?${params.toString()}`;
      },
      transformResponse: (response: UserModel) => {
        return response;
      },
      providesTags: () => [{ type: "userApi" }],
      keepUnusedDataFor: 0, // Do not keep cached data when not in use
    }),
    getUserById: build.query<UserDetailT, number>({
      query: (id: number) => `users/${id}`,
      transformResponse: (response: userDetailResT) => {
        return response.data;
      },
      providesTags: () => [{ type: "userById" }],
    }),
    createUser: build.mutation<
      CreateUserResponse,
      {
        name: string;
        email?: string;
        phone_number: string;
        username: string;
        agent_code?: string;
      }
    >({
      query: (userData) => ({
        url: "users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: () => [{ type: "userApi" }],
    }),
    updateUser: build.mutation<
      CreateUserResponse,
      {
        id: number;
        name: string;
        email?: string;
        phone_number: string;
        username: string;
        agent_code?: string;
      }
    >({
      query: ({ id, ...userData }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: () => [{ type: "userApi" }, { type: "userById" }],
    }),
    updateUserStepOne: build.mutation<StepOneResT, StepOneT>({
      query: (user: StepOneT) => ({
        url: `user-profile/${user.user_id}/update-step-one`,
        method: "POST",
        body: user,
      }),

      invalidatesTags: () => ["userById"],
    }),
    updateUserStepTwo: build.mutation<StepOneResT, StepTwoT>({
      query: (user: StepTwoT) => ({
        url: `user-profile/${user.user_id}/update-step-two`,
        method: "POST",
        body: user,
      }),
      invalidatesTags: () => ["userById"],
    }),
    updateUserStepThree: build.mutation<StepOneResT, StepThreeT>({
      query: (user: StepThreeT) => ({
        url: `user-profile/${user.user_id}/update-step-three`,
        method: "POST",
        body: user,
      }),
      invalidatesTags: () => ["userById"],
    }),
    toggleUser: build.mutation<Tuser, { adminId: number; deactivate: boolean }>({
      query: ({ adminId, deactivate }) => ({
        url: `users/${adminId}/toggle-status`,
        method: "PATCH",
        body: { deactivate },
      }),
      invalidatesTags: () => ["userApi"],
    }),
    verifyUser: build.mutation<
      CreateUserResponse,
      { id: number; password?: string; password_confirmation?: string }
    >({
      query: ({ id, password, password_confirmation }) => ({
        url: `users/${id}/verify`,
        method: "PUT",
        body: {
          ...(password && { password }),
          ...(password_confirmation && { password_confirmation }),
        },
      }),
      invalidatesTags: () => [{ type: "userApi" }, { type: "userById" }],
    }),
    resetPassword: build.mutation<
      CreateUserResponse,
      { id: number; password?: string; password_confirmation?: string }
    >({
      query: ({ id, password, password_confirmation }) => ({
        url: `users/${id}/reset-password`,
        method: "PUT",
        body: {
          password,
          password_confirmation,
        },
      }),
      invalidatesTags: () => [{ type: "userApi" }, { type: "userById" }],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useToggleUserMutation,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserStepOneMutation,
  useUpdateUserStepTwoMutation,
  useUpdateUserStepThreeMutation,
  useVerifyUserMutation,
  useResetPasswordMutation,
} = usersApiSlice;
