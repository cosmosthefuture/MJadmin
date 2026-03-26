import { appApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type GlobalCommissionSettingItem = {
  id: number;
  name: string;
  key: string;
  value: string;
  type: string;
  created_at: string;
  updated_at: string;
};

export type GlobalCommissionSettingMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type GlobalCommissionSettingResponse = {
  response: {
    status: string;
    message: string;
  };
  data: GlobalCommissionSettingItem[];
  meta: GlobalCommissionSettingMeta;
};

export type UpdateGlobalCommissionSettingPayload = {
  id: number;
  value: string;
};

export const globalCommissionSettingsApiSlice = appApi.injectEndpoints({
  endpoints: (build) => ({
    getGlobalCommissionSettings: build.query<
      GlobalCommissionSettingResponse,
      { page?: number; perPage?: number }
    >({
      query: ({ page = 1, perPage = DEFAULT_PER_PAGE } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", perPage.toString());
        return `global-commission-settings/all?${params.toString()}`;
      },
      transformResponse: (response: GlobalCommissionSettingResponse) => response,
      providesTags: () => [{ type: "globalCommissionSettings" }],
    }),
    updateGlobalCommissionSetting: build.mutation<
      GlobalCommissionSettingResponse,
      UpdateGlobalCommissionSettingPayload
    >({
      query: ({ id, value }) => ({
        url: `global-commission-settings/${id}`,
        method: "PUT",
        body: { value },
      }),
      invalidatesTags: () => [{ type: "globalCommissionSettings" }],
    }),
  }),
});

export const {
  useGetGlobalCommissionSettingsQuery,
  useUpdateGlobalCommissionSettingMutation,
} = globalCommissionSettingsApiSlice;
