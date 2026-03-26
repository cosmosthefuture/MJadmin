import { appApi } from "@/redux/services/appApi";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export type AdminAgentItem = {
  id: number;
  name: string;
  phone_number: string;
  username: string;
  agent_code: string;
  incentive_percentage: number;
  master_id: number;
  status: string;
  force_reset_password: boolean;
  is_default: number;
  last_logined: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type AdminAgentMeta = {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
};

export type AdminAgentListResponse = {
  response: {
    status: string;
    message: string;
  };
  data: AdminAgentItem[];
  meta: AdminAgentMeta;
};

export const adminAgentsApiSlice = appApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminAgents: build.query<
      AdminAgentListResponse,
      {
        page: number;
        perPage?: number;
        search?: string;
      }
    >({
      query: ({ page, perPage = DEFAULT_PER_PAGE, search }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: perPage.toString(),
        });

        if (search) {
          params.append("search", search);
        }

        return `agents/all?${params.toString()}`;
      },
      providesTags: () => [{ type: "adminAgents" }],
    }),
  }),
});

export const { useGetAdminAgentsQuery } = adminAgentsApiSlice;
