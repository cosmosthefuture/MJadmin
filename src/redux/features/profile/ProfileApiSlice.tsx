import {
  AdminProfileResponseT,
  ProfessionalProfileResponseT,
  ProfessionalProfileCreateT,
} from "@/types/types";
import { appApi } from "@/redux/services/appApi";

export const profileApiSlice = appApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminProfile: build.query<AdminProfileResponseT, void>({
      query: () => `admin-profile`,
      providesTags: () => [{ type: "adminProfileApi" }],
    }),

    updateAdminProfile: build.mutation<
      { message: string; data: { name: string; email: string } },
      { name: string; email: string }
    >({
      query: ({ name, email }) => ({
        url: `admin-profile`,
        method: "POST",
        body: { name, email },
      }),
      invalidatesTags: () => ["adminProfileApi"],
    }),
    getProfessionalProfile: build.query<ProfessionalProfileResponseT, void>({
      query: () => `professional/profile`,
      providesTags: () => [{ type: "professioanlProfileApi" }],
    }),

    updateProfessionalProfile: build.mutation<
      {
        message: string;
        data: ProfessionalProfileCreateT;
      },
      ProfessionalProfileCreateT
    >({
      query: (professionalProfile) => ({
        url: `professional/profile`,
        method: "POST",
        body: professionalProfile,
      }),
      invalidatesTags: () => ["professioanlProfileApi"],
    }),

    changeAdminPassword: build.mutation<
      {
        message: string;
        data: { new_password: string; new_password_confirmation: string };
      },
      { new_password: string; new_password_confirmation: string }
    >({
      query: ({ new_password, new_password_confirmation }) => ({
        url: `admin-profile/change-password`,
        method: "POST",
        body: { new_password, new_password_confirmation },
      }),
    }),
    changeProfessionalPassword: build.mutation<
      {
        message: string;
        data: { new_password: string; new_password_confirmation: string };
      },
      { new_password: string; new_password_confirmation: string }
    >({
      query: ({ new_password, new_password_confirmation }) => ({
        url: `professional/profile/change-password`,
        method: "POST",
        body: { new_password, new_password_confirmation },
      }),
    }),
  }),
});

export const {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useGetProfessionalProfileQuery,
  useUpdateProfessionalProfileMutation,
  useChangeAdminPasswordMutation,
  useChangeProfessionalPasswordMutation,
} = profileApiSlice;
