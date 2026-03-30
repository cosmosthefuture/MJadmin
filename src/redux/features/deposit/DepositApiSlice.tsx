import { appApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type DepositUser = {
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

export type DepositPaymentMethod = {
  id: number;
  type: string;
  account_username: string;
  phone_number: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type DepositItem = {
  id: number;
  user_id: number;
  payment_method_id: number;
  amount: number;
  last_six_digits_of_payment_slip: string;
  payment_slip_image_url: string;
  status: "pending" | "approved" | "rejected";
  reason_for_rejection: string | null;
  action_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: DepositUser;
  payment_method: DepositPaymentMethod;
};

export type DepositMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type DepositResponse = {
  response: {
    status: string;
    message: string;
  };
  data: DepositItem[];
  meta: DepositMeta;
};

export type UpdateDepositStatusRequest = {
  id: number;
  status: "pending" | "approved" | "rejected";
  reason_for_rejection?: string | null;
};

export type MasterDepositActionBy = {
  id: number;
  name: string;
  phone_number: string;
  username: string;
  status: string;
  force_reset_password: boolean;
  last_logined: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type MasterDepositMaster = {
  id: number;
  name: string;
  phone_number: string;
  username: string;
  winning_commission_percentage: number;
  status: string;
  force_reset_password: boolean;
  is_default: number;
  last_logined: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  balance: string;
};

export type MasterDepositItem = {
  id: number;
  master_id: number;
  amount: number;
  action_by: MasterDepositActionBy;
  date_time: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  master: MasterDepositMaster;
};

export type MasterDepositResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MasterDepositItem[];
  meta: DepositMeta;
};

export const depositApiSlice = appApi.injectEndpoints({
  endpoints: (build) => ({
    getDepositRequests: build.query<
      DepositResponse,
      { page?: number; perPage?: number; search?: string }
    >({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE, search } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        if (search) params.set("search", search);
        return `user-deposit-requests/all?${params.toString()}`;
      },
      transformResponse: (response: DepositResponse) => response,
      providesTags: () => [{ type: "depositRequests" }],
      keepUnusedDataFor: 0, // Do not keep cached data when not in use
    }),
    getManualDepositRequests: build.query<
      MasterDepositResponse,
      { page?: number; perPage?: number; search?: string }
    >({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE, search } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        if (search) params.set("search", search);
        return `masters/deposit-lists?${params.toString()}`;
      },
      transformResponse: (response: MasterDepositResponse) => response,
      providesTags: () => [{ type: "depositRequests" }],
      keepUnusedDataFor: 0,
    }),
    approveDepositRequest: build.mutation<DepositResponse, { id: number }>({
      query: ({ id }) => ({
        url: `user-deposit-requests/${id}/approve`,
        method: "PUT",
      }),
      invalidatesTags: () => [{ type: "depositRequests" }],
    }),
    rejectDepositRequest: build.mutation<
      DepositResponse,
      { id: number; reason_for_rejection: string }
    >({
      query: ({ id, reason_for_rejection }) => ({
        url: `user-deposit-requests/${id}/reject`,
        method: "PUT",
        body: { reason_for_rejection },
      }),
      invalidatesTags: () => [{ type: "depositRequests" }],
    }),
    manualCreateDeposit: build.mutation<
      DepositResponse,
      { user_id: number; amount: number; password?: string }
    >({
      query: (body) => ({
        url: `user-deposits/manual-create`,
        method: "POST",
        body,
      }),
      invalidatesTags: () => [{ type: "depositRequests" }],
    }),
  }),
});

export const {
  useGetDepositRequestsQuery,
  useGetManualDepositRequestsQuery,
  useApproveDepositRequestMutation,
  useRejectDepositRequestMutation,
  useManualCreateDepositMutation,
} = depositApiSlice;
