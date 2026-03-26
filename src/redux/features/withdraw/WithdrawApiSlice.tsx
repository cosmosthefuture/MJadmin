import { appApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type WithdrawUser = {
  id: number;
  name: string;
  username: string;
  phone_number: string;
  email: string;
  status: string;
  is_verified: boolean;
  last_logined: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type WithdrawPaymentMethod = {
  id: number;
  type: string;
  account_username: string;
  phone_number: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type WithdrawItem = {
  id: number;
  user_id: number;
  payment_method_id: number;
  amount: number;
  last_six_digits_of_payment_slip?: string;
  payment_slip_image_url?: string;
  status: "pending" | "approved" | "rejected";
  reason_for_rejection?: string | null;
  action_by?: number | { id: number; name: string; phone_number: string; username: string } | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: WithdrawUser;
  payment_method: WithdrawPaymentMethod;
};

export type WithdrawMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type WithdrawResponse = {
  response: {
    status: string;
    message: string;
  };
  data: WithdrawItem[];
  meta: WithdrawMeta;
};

export const withdrawApiSlice = appApi.injectEndpoints({
  endpoints: (build) => ({
    getWithdrawRequests: build.query<
      WithdrawResponse,
      { page?: number; perPage?: number; search?: string }
    >({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE, search } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        if (search) params.set("search", search);
        return `user-withdraw-requests/all?${params.toString()}`;
      },
      transformResponse: (response: WithdrawResponse) => response,
      providesTags: () => [{ type: "withdrawRequests" }],
      keepUnusedDataFor: 0, // Do not keep cached data when not in use
    }),
    getManualWithdrawRequests: build.query<
      WithdrawResponse,
      { page?: number; perPage?: number; search?: string }
    >({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE, search } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        if (search) params.set("search", search);
        return `user-withdraw-requests/manual?${params.toString()}`;
      },
      transformResponse: (response: WithdrawResponse) => response,
      providesTags: () => [{ type: "withdrawRequests" }],
      keepUnusedDataFor: 0, // Do not keep cached data when not in use
    }),
    approveWithdrawRequest: build.mutation<WithdrawResponse, { id: number }>({
      query: ({ id }) => ({
        url: `user-withdraw-requests/${id}/approve`,
        method: "PUT",
      }),
      invalidatesTags: () => [{ type: "withdrawRequests" }],
    }),
    rejectWithdrawRequest: build.mutation<
      WithdrawResponse,
      { id: number; reason_for_rejection: string }
    >({
      query: ({ id, reason_for_rejection }) => ({
        url: `user-withdraw-requests/${id}/reject`,
        method: "PUT",
        body: { reason_for_rejection },
      }),
      invalidatesTags: () => [{ type: "withdrawRequests" }],
    }),
    manualCreateWithdraw: build.mutation<
      WithdrawResponse,
      { user_id: number; amount: number; password?: string }
    >({
      query: (body) => ({
        url: `user-withdraws/manual-create`,
        method: "POST",
        body,
      }),
      invalidatesTags: () => [{ type: "withdrawRequests" }],
    }),
  }),
});

export const {
  useGetWithdrawRequestsQuery,
  useGetManualWithdrawRequestsQuery,
  useApproveWithdrawRequestMutation,
  useRejectWithdrawRequestMutation,
  useManualCreateWithdrawMutation,
} = withdrawApiSlice;
