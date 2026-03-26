import { masterAppApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type MasterWithdrawHistoryItem = {
  id: number;
  master_id: number;
  payment_method_id: number;
  amount: number;
  receiver_phone_number: string;
  status: string;
  reason_for_rejection: string | null;
  action_by: unknown;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  master: {
    id: number;
    name: string;
    phone_number: string;
    username: string;
    incentive_percentage: number;
    status: string;
    force_reset_password: boolean;
    is_default: number;
    last_logined: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  payment_method: {
    id: number;
    type: string;
    account_username: string;
    phone_number: string;
    status: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
};

export type MasterWithdrawHistoryMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type MasterWithdrawHistoryResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MasterWithdrawHistoryItem[];
  meta: MasterWithdrawHistoryMeta;
};

export type CreateMasterWithdrawRequestPayload = {
  payment_method_id: number;
  amount: number;
  receiver_phone_number: string;
  password: string;
};

export type CreateMasterWithdrawRequestResponse = {
  response: {
    status: string;
    message: string;
  };
  data: {
    id: number;
    master_id: number;
    payment_method_id: number;
    amount: number;
    receiver_phone_number: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
};

export type MasterPaymentMethod = {
  id: number;
  type: string;
  account_username: string;
  phone_number: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type MasterPaymentMethodMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type MasterPaymentMethodResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MasterPaymentMethod[];
  meta: MasterPaymentMethodMeta;
};

export const masterWithdrawApiSlice = masterAppApi.injectEndpoints({
  endpoints: (build) => ({
    getMasterPaymentMethods: build.query<
      MasterPaymentMethodResponse,
      { page?: number; perPage?: number }
    >({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE } = {}) =>
        `payment-methods/all?page=${page}&per_page=${perPage}`,
      transformResponse: (response: MasterPaymentMethodResponse) => response,
      providesTags: () => [{ type: "masterPaymentMethods" }],
    }),
    getMasterWithdrawHistory: build.query<
      MasterWithdrawHistoryResponse,
      { page?: number; per_page?: number }
    >({
      query: ({ page = 1, per_page = DEFAULT_PER_PAGE } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", per_page.toString());
        return `withdraw-history?${params.toString()}`;
      },
      transformResponse: (response: MasterWithdrawHistoryResponse) => response,
      providesTags: () => [{ type: "masterWithdrawHistory" }],
    }),
    createMasterWithdrawRequest: build.mutation<
      CreateMasterWithdrawRequestResponse,
      CreateMasterWithdrawRequestPayload
    >({
      query: (body) => ({
        url: "withdraw-requests/create",
        method: "POST",
        body,
      }),
      invalidatesTags: () => [{ type: "masterWithdrawHistory" }],
    }),
  }),
});

export const {
  useGetMasterPaymentMethodsQuery,
  useGetMasterWithdrawHistoryQuery,
  useCreateMasterWithdrawRequestMutation,
} = masterWithdrawApiSlice;
