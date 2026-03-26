import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { store } from "../redux/store";
import { clearToken, setUserData } from "./features/AuthSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCookie, getCookie, removeCookie } from "@/utils/cookie";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");

const http = axios.create({
  baseURL: `${apiBaseUrl}/admins`,
});

const masterHttp = axios.create({
  baseURL: `${apiBaseUrl}/masters`,
});

const agentHttp = axios.create({
  baseURL: `${apiBaseUrl}/agents`,
});

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    if (config.headers && config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 422) {
      console.log("return", error.response);
      return error.response;
    }
    return Promise.reject(error);
  }
);

masterHttp.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    if (config.headers && config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

masterHttp.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 422) {
      return error.response;
    }
    return Promise.reject(error);
  }
);

agentHttp.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    if (config.headers && config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

agentHttp.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 422) {
      return error.response;
    }
    return Promise.reject(error);
  }
);

const ensureToken = async () => {
  const res = await getCookie("userInfo");
  const response = res
    ? (JSON.parse(res) as {
        status: number;
        data: {
          userData: {
            token: string;
            permissions: string;
            id: string;
            name: string;
            email: string;
            role: string;
            authType: "admin" | "master" | "agent" | "professional";
          };
        };
      })
    : null;
  if (response?.status === 200) {
    const userInfo = response.data.userData;
    const token = userInfo.token;
    const permissions = userInfo.permissions ? JSON.parse(userInfo.permissions) : [];

    if (!token) {
      throw new Error("Token not available");
    }
    return { token, permissions };
  } else {
    throw new Error("Token not available");
  }
};

type AdminLoginPayload = {
  phone_number: string;
  password: string;
};

type AdminLoginResponse = {
  response: {
    status: string;
    message: string;
  };
  data: {
    token_type: string;
    accessToken: string;
    user: {
      id: number;
      name: string;
      email: string;
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
    permission_list: {
      permission_type_id: number;
      permission_type_name: string;
    }[];
  };
};

export const masterLogin = async (payload: AdminLoginPayload) => {
  try {
    const response = await masterHttp.post("/auth/login", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 422) {
      return response;
    }

    if (response.status === 200) {
      const apiFormData = new FormData();
      apiFormData.append("token", response.data.data.accessToken);
      apiFormData.append("id", response.data.data.user.id.toString());
      apiFormData.append("name", response.data.data.user.name);
      apiFormData.append("email", response.data.data.user.email);
      apiFormData.append("role", response.data.data.user.username);
      apiFormData.append("status", "");
      apiFormData.append("permissions", JSON.stringify([]));
      apiFormData.append("authType", "master");
      await setCookie("userInfo", apiFormData);
    }

    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 422) {
      return error.response;
    }
    throw error;
  }
};

export const agentLogin = async (payload: AdminLoginPayload) => {
  try {
    const response = await agentHttp.post("/auth/login", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 422) {
      return response;
    }

    if (response.status === 200) {
      const apiFormData = new FormData();
      apiFormData.append("token", response.data.data.accessToken);
      apiFormData.append("id", response.data.data.user.id.toString());
      apiFormData.append("name", response.data.data.user.name);
      apiFormData.append("email", response.data.data.user.email);
      apiFormData.append("role", response.data.data.user.username);
      apiFormData.append("status", "");
      apiFormData.append("permissions", JSON.stringify([]));
      apiFormData.append("authType", "agent");
      await setCookie("userInfo", apiFormData);
    }

    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 422) {
      return error.response;
    }
    throw error;
  }
};

export const adminLogin = async (payload: AdminLoginPayload) => {
  try {
    const response: AxiosResponse<AdminLoginResponse> = await http.post("/auth/login", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 422) {
      // check error
      return response;
    }
    const apiFormData = new FormData();
    apiFormData.append("token", response.data.data.accessToken);
    apiFormData.append("id", response.data.data.user.id.toString());
    apiFormData.append("name", response.data.data.user.name);
    apiFormData.append("email", response.data.data.user.email);
    apiFormData.append("role", response.data.data.user.username);
    apiFormData.append("status", "");
    apiFormData.append("authType", "admin");
    await setCookie("userInfo", apiFormData);
    const loginData = response.data.data as AdminLoginResponse["data"];
    store.dispatch(
      setUserData({
        id: loginData.user.id.toString(),
        name: loginData.user.name,
        email: loginData.user.email,
        permissions: loginData.permission_list.map((p) => p.permission_type_name),
        authType: "admin",
      })
    );

    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 422) {
      return error.response;
    }
    throw error;
  }
};

export const fetchDataWithToken = async (uri: string) => {
  try {
    const { token } = await ensureToken();
    const response = await http.get(uri, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const postDataWithToken = async (uri: string, data: FormData) => {
  try {
    const { token } = await ensureToken();
    const response = await http.post(uri, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 422) {
      return response;
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw error;
  }
};

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      const authType = store.getState().auth.authType;
      if (authType === "master") {
        await masterHttp.post("/auth/logout");
      } else if (authType === "agent") {
        await agentHttp.post("/auth/logout");
      } else {
        await http.post("/auth/logout");
      }
    } catch {
      // ignore
    } finally {
      dispatch(clearToken());
      await removeCookie("userInfo");
      router.push("/login");
    }
  };

  return logout;
};

const api = {
  http,
  masterHttp,
  agentHttp,
  adminLogin,
  masterLogin,
  agentLogin,
  fetchDataWithToken,
  postDataWithToken,
};
export default api;
