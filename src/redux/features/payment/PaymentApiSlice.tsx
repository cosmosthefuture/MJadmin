import { appApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type PaymentMethod = {
  id: number;
  type: string;
  account_username: string;
  phone_number: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type PaymentMethodMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type PaymentMethodResponse = {
  response: {
    status: string;
    message: string;
  };
  data: PaymentMethod[];
  meta: PaymentMethodMeta;
};

export type CreatePaymentRequest = {
  type: string;
  account_username: string;
  phone_number: string;
};

export type CreatePaymentResponse = {
  response: {
    status: string;
    message: string;
  };
  data: PaymentMethod;
};

export const paymentApiSlice = appApi.injectEndpoints({
  endpoints: (build) => ({
    getPaymentMethods: build.query<PaymentMethodResponse, { page?: number; perPage?: number }>({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE } = {}) =>
        `payment-methods/all?page=${page}&per_page=${perPage}`,
      transformResponse: (response: PaymentMethodResponse) => response,
      providesTags: () => [{ type: "paymentMethods" }],
    }),
    createPaymentMethod: build.mutation<CreatePaymentResponse, CreatePaymentRequest>({
      query: (body) => ({
        url: "payment-methods",
        method: "POST",
        body,
      }),
      invalidatesTags: () => [{ type: "paymentMethods" }],
    }),
    updatePaymentMethod: build.mutation<
      CreatePaymentResponse,
      CreatePaymentRequest & { id: number }
    >({
      query: ({ id, ...body }) => ({
        url: `payment-methods/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: () => [{ type: "paymentMethods" }],
    }),
    togglePaymentMethod: build.mutation<PaymentMethod, { id: number; deactivate: boolean }>({
      query: ({ id, deactivate }) => ({
        url: `payment-methods/${id}/toggle-status`,
        method: "PATCH",
        body: { deactivate },
      }),
      invalidatesTags: () => [{ type: "paymentMethods" }],
    }),
  }),
});

export const {
  useGetPaymentMethodsQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useTogglePaymentMethodMutation,
} = paymentApiSlice;
