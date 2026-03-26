import { appApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type AdminMasterWithdrawItem = {
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

export type AdminMasterWithdrawMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type AdminMasterWithdrawResponse = {
  response: {
    status: string;
    message: string;
  };
  data: AdminMasterWithdrawItem[];
  meta: AdminMasterWithdrawMeta;
};

export const adminMasterWithdrawApiSlice = appApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminMasterWithdrawRequests: build.query<
      AdminMasterWithdrawResponse,
      { page?: number; perPage?: number; search?: string }
    >({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE, search } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: perPage.toString(),
        });

        if (search) {
          params.append("search", search);
        }

        return `master-withdraw-requests/all?${params.toString()}`;
      },
      transformResponse: (response: AdminMasterWithdrawResponse) => response,
      providesTags: () => [{ type: "adminMasterWithdrawRequests" }],
      keepUnusedDataFor: 0, // Do not keep cached data when not in use
    }),

    approveAdminMasterWithdrawRequest: build.mutation<
      { response: { status: string; message: string } },
      { id: number }
    >({
      query: ({ id }) => ({
        url: `master-withdraw-requests/${id}/approve`,
        method: "PUT",
      }),
      invalidatesTags: () => [{ type: "adminMasterWithdrawRequests" }],
    }),

    rejectAdminMasterWithdrawRequest: build.mutation<
      { response: { status: string; message: string } },
      { id: number; reason_for_rejection: string }
    >({
      query: ({ id, reason_for_rejection }) => ({
        url: `master-withdraw-requests/${id}/reject`,
        method: "PUT",
        body: { reason_for_rejection },
      }),
      invalidatesTags: () => [{ type: "adminMasterWithdrawRequests" }],
    }),
  }),
});

export const {
  useGetAdminMasterWithdrawRequestsQuery,
  useApproveAdminMasterWithdrawRequestMutation,
  useRejectAdminMasterWithdrawRequestMutation,
} = adminMasterWithdrawApiSlice;
