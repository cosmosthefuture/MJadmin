import { appApi } from "@/redux/services/appApi";

export type MasterItem = {
  id: number;
  name: string;
  email?: string;
  phone_number: string;
  username: string;
  winning_commission_percentage?: number;
  incentive_percentage?: number;
  status: string;
  force_reset_password: boolean;
  is_default?: number;
  last_logined: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  balance?: string;
};

export type MasterMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type MasterListResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MasterItem[];
  meta: MasterMeta;
};

export type CreateMasterPayload = {
  name: string;
  email?: string;
  phone_number: string;
  username: string;
  winning_commission_percentage: number;
  password: string;
  password_confirmation: string;
};

export type CreateMasterResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MasterItem;
};

export type MasterDetailResponse = {
  response: {
    status: string;
    message: string;
  };
  data: MasterItem;
};

export type UpdateMasterPayload = {
  id: number;
  name: string;
  email?: string;
  phone_number: string;
  username: string;
  winning_commission_percentage: number;
};

export type AddMoneyToMasterPayload = {
  master_id: number;
  amount: string;
};

export const masterApiSlice = appApi.injectEndpoints({
  endpoints: (build) => ({
    getAllMasters: build.query<
      MasterListResponse,
      { page: number; perPage?: number; search?: string }
    >({
      query: ({ page, perPage = 10, search }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: perPage.toString(),
        });

        if (search) {
          params.append("search", search);
        }

        return `masters/all?${params.toString()}`;
      },
      transformResponse: (response: MasterListResponse) => response,
      providesTags: () => [{ type: "mastersApi" }],
    }),

    getMasterById: build.query<MasterItem, number>({
      query: (id: number) => `masters/${id}`,
      transformResponse: (response: MasterDetailResponse) => response.data,
      providesTags: () => [{ type: "mastersApi" }],
    }),

    createMaster: build.mutation<CreateMasterResponse, CreateMasterPayload>({
      query: (masterData) => ({
        url: "masters",
        method: "POST",
        body: masterData,
      }),
      invalidatesTags: () => [{ type: "mastersApi" }],
    }),

    updateMaster: build.mutation<CreateMasterResponse, UpdateMasterPayload>({
      query: ({ id, ...masterData }) => ({
        url: `masters/${id}`,
        method: "PUT",
        body: masterData,
      }),
      invalidatesTags: () => [{ type: "mastersApi" }],
    }),

    addMoneyToMaster: build.mutation<CreateMasterResponse, AddMoneyToMasterPayload>({
      query: (payload) => ({
        url: "masters/add-money",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: () => [{ type: "mastersApi" }],
    }),

    toggleMasterStatus: build.mutation<
      CreateMasterResponse,
      {
        id: number;
        deactivate: boolean;
      }
    >({
      query: ({ id, deactivate }) => ({
        url: `masters/${id}/toggle-status`,
        method: "PATCH",
        body: { deactivate },
      }),
      invalidatesTags: () => [{ type: "mastersApi" }],
    }),
  }),
});

export const {
  useGetAllMastersQuery,
  useGetMasterByIdQuery,
  useCreateMasterMutation,
  useUpdateMasterMutation,
  useAddMoneyToMasterMutation,
  useToggleMasterStatusMutation,
} = masterApiSlice;
