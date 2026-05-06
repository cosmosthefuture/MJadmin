import { agentAppApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type AgentPaymentMethod = {
  id: number;
  type: string;
  account_username: string;
  phone_number: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type AgentPaymentMethodMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type AgentPaymentMethodResponse = {
  response: {
    status: string;
    message: string;
  };
  data: AgentPaymentMethod[];
  meta: AgentPaymentMethodMeta;
};

export type CreateAgentWithdrawRequest = {
  payment_method_id: number;
  amount: number;
  receiver_phone_number: string;
  password: string;
};

export type CreateAgentWithdrawResponse = {
  response: {
    status: string;
    message: string;
  };
};

export const agentWithdrawRequestForAgentApiSlice = agentAppApi.injectEndpoints({
  endpoints: (build) => ({
    getAgentPaymentMethods: build.query<
      AgentPaymentMethodResponse,
      { page?: number; perPage?: number }
    >({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE } = {}) =>
        `payment-methods/all?page=${page}&per_page=${perPage}`,
      transformResponse: (response: AgentPaymentMethodResponse) => response,
      providesTags: () => [{ type: "agentPaymentMethods" }],
    }),
    createAgentWithdrawRequest: build.mutation<
      CreateAgentWithdrawResponse,
      CreateAgentWithdrawRequest
    >({
      query: (body) => ({
        url: "withdraw-requests/create",
        method: "POST",
        body,
      }),
      invalidatesTags: () => [{ type: "agentPaymentMethods" }],
    }),
  }),
});

export const {
  useGetAgentPaymentMethodsQuery,
  useCreateAgentWithdrawRequestMutation,
} = agentWithdrawRequestForAgentApiSlice;
