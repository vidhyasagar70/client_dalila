import axios, { AxiosInstance, AxiosError } from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://dalila-inventory-service-dev.caratlogic.com";

export const UNAUTHORIZED_EVENT = "unauthorized_access";

// Interfaces
interface FetchParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: Record<string, string | number | boolean>;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  userId?: string;
  field?: string;
  searchTerm?: string;
}
interface DashboardStats {
  totalDiamonds: number;
  newlyAddedDiamonds: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
  error?: string;
}

interface PaginationData<T> {
  diamonds?: T[];
  users?: T[];
  quotations?: T[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

interface FilterOptions {
  colors: string[];
  clarities: string[];
  cuts: string[];
  polishGrades: string[];
  symmetryGrades: string[];
  fluorescenceTypes: string[];
  labs: string[];
  shapes: string[];
  locations: string[];
  stages: string[];
  netRateRange: {
    min: number;
    max: number;
  };
  rapPriceRange: {
    min: number;
    max: number;
  };
  caratRange: {
    min: number;
    max: number;
  };
}

interface Diamond {
  stoneNo: string;
  shape?: string;
  color?: string;
  clarity?: string;
  cut?: string;
  carats?: number;
  price?: number;
  [key: string]: unknown;
}

interface LimitedEditionDiamond {
  STONE_NO: string;
  SHAPE: string;
  CARATS: string;
  COLOR: string;
  CLARITY: string;
  CUT: string;
  POL: string;
  SYM: string;
  LAB: string;
  MP4: string;
  REAL_IMAGE: string;
  ARROW_IMAGE: string;
  HEART_IMAGE: string;
  CERTI_PDF: string;
  NET_RATE: string;
  NET_VALUE: string;
  DISC_PER: string;
  RAP_PRICE: string;
  FLOUR: string;
  [key: string]: unknown;
}

interface User {
  _id?: string;
  id: string;
  username?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isVerified?: boolean;
  kycStatus?: string;
  status?: string;
  role?: string;
  customerData?: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    countryCode: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    businessInfo: {
      companyName: string;
      businessType: string;
      vatNumber: string;
      websiteUrl?: string;
    };
    submittedAt?: string;
  };
  [key: string]: unknown;
}
interface Blog {
  _id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface BlogPaginationData {
  data: Blog[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface BlogResponseAll {
  success: boolean;
  message: string;
  data: Blog[];
  totalRecords: number;
}

interface BlogResponseSingle {
  success: boolean;
  message: string;
  data: Blog;
}
interface CartItem {
  stoneNo: string;
  [key: string]: unknown;
}

interface Quotation {
  id: string;
  stoneNumbers: string[];
  message: string;
  urgency?: string;
  status?: string;
  [key: string]: unknown;
}

const getAuthToken = (): string => {
  // First try to get from cookies
  const cookieToken = getAuthTokenFromCookies();
  if (cookieToken) {
    return cookieToken;
  }

  // Fallback to localStorage
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    return token || "";
  }
  return "";
};

const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return token !== null && token !== undefined && token.trim() !== "";
};

const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
};

const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authTokenTimestamp");
  }
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken(); // This now checks cookies first
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access. Clearing token and redirecting...");
      removeAuthToken();

      // Dispatch custom event for unauthorized access
      if (typeof window !== "undefined") {
        const unauthorizedEvent = new CustomEvent(UNAUTHORIZED_EVENT);
        window.dispatchEvent(unauthorizedEvent);
      }
    }
    return Promise.reject(error);
  },
);

const getAuthTokenFromCookies = (): string => {
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split(";");
    const authCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("authToken="),
    );
    if (authCookie) {
      return authCookie.split("=")[1];
    }
  }
  return "";
};

// Generic API methods
export const api = {
  // GET with query parameters
  get: async <T>(
    endpoint: string,
    params: FetchParams = {},
  ): Promise<ApiResponse<T> | null> => {
    try {
      // Skip token check for public endpoints
      const publicEndpoints = [
        "/health",
        "/api/diamonds/filter-options",
        "/api/diamonds/all",
        "/api/diamonds/search",
        "/api/diamonds",
      ];
      const isPublicEndpoint = publicEndpoints.some((pub) =>
        endpoint.includes(pub),
      );

      if (!isPublicEndpoint) {
        const token = getAuthToken();
        if (!token || token.trim() === "") {
          console.error("Unauthorized. Please log in.");
          if (typeof window !== "undefined") {
            const unauthorizedEvent = new CustomEvent(UNAUTHORIZED_EVENT);
            window.dispatchEvent(unauthorizedEvent);
          }
          return null;
        }
      }

      const queryParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (typeof value === "object") {
            Object.entries(value).forEach(([filterKey, filterValue]) => {
              if (
                filterValue !== undefined &&
                filterValue !== null &&
                filterValue !== ""
              ) {
                queryParams.append(filterKey, String(filterValue));
              }
            });
          } else {
            queryParams.append(key, String(value));
          }
        }
      });

      const url = queryParams.toString()
        ? `${endpoint}?${queryParams.toString()}`
        : endpoint;
      console.log("API Request URL:", url);

      const response = await apiClient.get<ApiResponse<T>>(url);
      return response.data;
    } catch (error) {
      console.error("GET Error:", error);
      return null;
    }
  },

  // GET by ID
  getById: async <T>(
    endpoint: string,
    id: string | number,
  ): Promise<ApiResponse<T> | null> => {
    try {
      const token = getAuthToken();
      if (!token || token.trim() === "") {
        console.error("Unauthorized. Please log in.");
        if (typeof window !== "undefined") {
          const unauthorizedEvent = new CustomEvent(UNAUTHORIZED_EVENT);
          window.dispatchEvent(unauthorizedEvent);
        }
        return null;
      }

      const response = await apiClient.get<ApiResponse<T>>(`${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error("GET by ID Error:", error);
      return null;
    }
  },

  // POST
  post: async <T>(endpoint: string, data: object): Promise<ApiResponse<T>> => {
    try {
      const response = await apiClient.post<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (error: unknown) {
      console.error("POST Error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: {
              error?: string;
              message?: string;
              success?: boolean;
            };
          };
        };

        // If backend returns a structured error response, return it instead of throwing
        if (axiosError.response?.data) {
          const errorData = axiosError.response.data;

          // Return the error as a failed response instead of throwing
          return {
            success: false,
            message: errorData.message || errorData.error || "Request failed",
            error: errorData.error || errorData.message || "Request failed",
          } as ApiResponse<T>;
        }
      }

      // For network errors or other issues, throw
      throw error;
    }
  },

  // PUT
  put: async <T>(
    endpoint: string,
    id: string,
    data: object,
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await apiClient.put<ApiResponse<T>>(
        `${endpoint}/${id}`,
        data,
      );
      return response.data;
    } catch (error: unknown) {
      console.error("PUT Error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { error?: string; message?: string } };
        };
        if (axiosError.response?.data) {
          throw new Error(
            axiosError.response.data.error ||
              axiosError.response.data.message ||
              "Request failed",
          );
        }
      }
      throw error;
    }
  },

  // PATCH
  patch: async <T>(
    endpoint: string,
    id: string,
    data: object,
  ): Promise<ApiResponse<T> | null> => {
    try {
      const response = await apiClient.patch<ApiResponse<T>>(
        `${endpoint}/${id}`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("PATCH Error:", error);
      return null;
    }
  },

  // DELETE
  delete: async <T = unknown>(
    endpoint: string,
    id: string,
  ): Promise<ApiResponse<T> | null> => {
    try {
      const response = await apiClient.delete<ApiResponse<T>>(
        `${endpoint}/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error("DELETE Error:", error);
      return null;
    }
  },
};

// Diamond API endpoints
export const diamondApi = {
  // Get all diamonds with pagination
  getAll: (params?: FetchParams) =>
    api.get<PaginationData<Diamond>>("/api/diamonds", params),

  // Get all diamonds without pagination
  getAllNoPagination: () =>
    api.get<{ diamonds: Diamond[] }>("/api/diamonds/all"),

  search: (filters: {
    color?: string;
    clarity?: string;
    cut?: string;
    shape?: string;
    polish?: string;
    symmetry?: string;
    minCarats?: number;
    maxCarats?: number;
    minPrice?: number;
    maxPrice?: number;
    lab?: string;
    location?: string;
    stage?: string;
    page?: number;
    limit?: number;
    fluorescence?: string;
    searchTerm?: string;
    CN?: string;
    CW?: string;
    SN?: string;
    SW?: string;
    keyToSymbols?: string;
    eyCln?: string;
    hAndA?: string;
    netRateMin?: number;
    netRateMax?: number;
    netValueMin?: number;
    netValueMax?: number;
    discPerMin?: number;
    discPerMax?: number;
  }) => {
    const queryParams = new URLSearchParams();

    // Helper function to add multiple values as separate query parameters
    const addMultipleParams = (paramName: string, value: string) => {
      if (!value) return;

      const values = value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

      // Add each value as a separate query parameter for OR logic
      values.forEach((val) => {
        queryParams.append(paramName, val);
      });
    };

    // Handle SHAPE
    if (filters.shape) {
      addMultipleParams("SHAPE", filters.shape);
    }

    // Handle COLOR
    if (filters.color) {
      addMultipleParams("COLOR", filters.color);
    }

    // Handle CLARITY
    if (filters.clarity) {
      addMultipleParams("CLARITY", filters.clarity);
    }

    // Handle CUT
    if (filters.cut) {
      addMultipleParams("CUT", filters.cut);
    }

    // Handle POLISH
    if (filters.polish) {
      addMultipleParams("POL", filters.polish);
    }

    // Handle SYMMETRY
    if (filters.symmetry) {
      addMultipleParams("SYM", filters.symmetry);
    }

    // Handle FLUORESCENCE
    if (filters.fluorescence) {
      addMultipleParams("FLOUR", filters.fluorescence);
    }

    // Handle LOCATION
    if (filters.location) {
      addMultipleParams("LOCATION", filters.location);
    }

    // Handle LAB
    if (filters.lab) {
      addMultipleParams("LAB", filters.lab);
    }

    // Handle INCLUSIONS
    if (filters.CN) {
      addMultipleParams("CN", filters.CN);
    }

    if (filters.CW) {
      addMultipleParams("CW", filters.CW);
    }

    if (filters.SN) {
      addMultipleParams("SN", filters.SN);
    }

    if (filters.SW) {
      addMultipleParams("SW", filters.SW);
    }

    // Handle KEY_TO_SYMBOLS - Server-side filtering
    if (filters.keyToSymbols) {
      addMultipleParams("KEY_TO_SYMBOLS", filters.keyToSymbols);
    }

    // Handle EY_CLN - Server-side filtering
    if (filters.eyCln) {
      addMultipleParams("EY_CLN", filters.eyCln);
    }

    // Handle H_AND_A - Server-side filtering
    if (filters.hAndA) {
      addMultipleParams("H_AND_A", filters.hAndA);
    }

    // Handle CARAT RANGE
    if (filters.minCarats !== undefined) {
      queryParams.append("CARATS_MIN", filters.minCarats.toString());
    }
    if (filters.maxCarats !== undefined) {
      queryParams.append("CARATS_MAX", filters.maxCarats.toString());
    }

    // Handle PRICE RANGE
    if (filters.minPrice !== undefined) {
      queryParams.append("MIN_PRICE", filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      queryParams.append("MAX_PRICE", filters.maxPrice.toString());
    }

    // Handle STAGE
    if (filters.stage) {
      addMultipleParams("STAGE", filters.stage);
    }
    if (filters.netRateMin !== undefined) {
      queryParams.append("NET_RATE_MIN", filters.netRateMin.toString());
    }
    if (filters.netRateMax !== undefined) {
      queryParams.append("NET_RATE_MAX", filters.netRateMax.toString());
    }
    if (filters.netValueMin !== undefined) {
      queryParams.append("NET_VALUE_MIN", filters.netValueMin.toString());
    }
    if (filters.netValueMax !== undefined) {
      queryParams.append("NET_VALUE_MAX", filters.netValueMax.toString());
    }
    if (filters.discPerMin !== undefined) {
      queryParams.append("DISC_PER_MIN", filters.discPerMin.toString());
    }
    if (filters.discPerMax !== undefined) {
      queryParams.append("DISC_PER_MAX", filters.discPerMax.toString());
    }

    // Handle SEARCH TERM
    if (filters.searchTerm) {
      queryParams.append("searchTerm", filters.searchTerm);
    }

    // Handle PAGINATION
    if (filters.page !== undefined) {
      queryParams.append("page", filters.page.toString());
    }
    if (filters.limit !== undefined) {
      queryParams.append("limit", filters.limit.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/api/diamonds/search?${queryString}`
      : "/api/diamonds/search";

    console.log("Search API called with URL:", endpoint);

    return apiClient
      .get<ApiResponse<PaginationData<Diamond>>>(endpoint)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Search error:", error);
        throw error;
      });
  },
  // Get filter options
  getFilterOptions: async (): Promise<ApiResponse<FilterOptions> | null> => {
    try {
      const response = await apiClient.get<ApiResponse<FilterOptions>>(
        "/api/diamonds/filter-options",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching filter options:", error);
      return null;
    }
  },

  sync: (credentials: { username: string; password: string }) =>
    api.post<{ message: string }>("/api/diamonds/sync", credentials),

  // Refresh diamonds
  refresh: () => api.post<{ message: string }>("/api/diamonds/refresh", {}),

  // Email diamonds
  email: async (data: { stoneNumbers: string[]; emails: string[] }) => {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: {
          totalRequested: number;
          totalFound: number;
          totalEmailed: number;
          foundStoneNumbers: string[];
          notFoundStoneNumbers: string[];
          result: string;
        };
      }>("/api/diamonds/email", data);
      return response.data;
    } catch (error) {
      console.error("Email error:", error);
      throw error;
    }
  },
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats> | null> => {
    try {
      const token = getAuthToken();
      if (!token || token.trim() === "") {
        console.error("No auth token found for dashboard stats");
        return null;
      }

      const response = await apiClient.get<ApiResponse<DashboardStats>>(
        "/api/diamonds/dashboard",
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return null;
    }
  },

  getLimitedEdition: async (): Promise<ApiResponse<{ diamonds: LimitedEditionDiamond[]; count: number }> | null> => {
    try {
      const response = await apiClient.get<ApiResponse<{ diamonds: LimitedEditionDiamond[]; count: number }>>(
        "/api/diamonds/limited-edition",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching limited edition diamonds:", error);
      return null;
    }
  },

  saveLimitedEditionFilters: async (filters: {
    SHAPE?: string;
    COLOR?: string;
    CLARITY?: string;
    CUT?: string;
    POL?: string;
    SYM?: string;
    LAB?: string;
    FLOUR?: string;
    CARATS_MIN?: string;
    CARATS_MAX?: string;
  }): Promise<ApiResponse<{ diamonds: LimitedEditionDiamond[]; count: number }> | null> => {
    try {
      const response = await apiClient.post<ApiResponse<{ diamonds: LimitedEditionDiamond[]; count: number }>>(
        "/api/diamonds/limited-edition",
        filters
      );
      return response.data;
    } catch (error) {
      console.error("Error saving limited edition filters:", error);
      return null;
    }
  },
};

export const cartApi = {
  // Add to cart
  add: (stoneNo: string) =>
    api.post<{ message: string }>("/api/diamonds/cart/add", { stoneNo }),

  // Get cart items - UPDATED INTERFACE
  get: () =>
    api.get<{
      cart: {
        items: Array<{
          stoneNo: string;
          diamond: Diamond;
          addedAt: string;
          _id: string;
        }>;
        _id: string;
        userId: string;
        createdAt: string;
        updatedAt: string;
      };
      totalItems: number;
    }>("/api/diamonds/cart"),

  // Get specific cart item
  getByStoneNo: (stoneNo: string) =>
    api.get<{ cartItem: CartItem }>(`/api/diamonds/cart/${stoneNo}`),

  // Remove from cart
  remove: (stoneNo: string) =>
    api.delete<{ message: string }>("/api/diamonds/cart", stoneNo),

  // Clear cart
  clear: () => api.delete<{ message: string }>("/api/diamonds/cart", ""),
};

// User API endpoints
export const userApi = {
  // Authentication
  register: async (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      const response = await api.post<{
        user: User;
      }>("/api/users/register", data);
      return response;
    } catch (error: unknown) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  login: async (data: { email: string; password: string }) => {
    try {
      const response = await api.post<{ user: User; token: string }>(
        "/api/users/login",
        data,
      );

      console.log("Login API Response:", response);
      console.log("Response structure:", JSON.stringify(response, null, 2));

      if (response.success) {
        let token: string | undefined = undefined;
        let user: User | undefined = undefined;

        if (response.data) {
          token = response.data.token;
          user = response.data.user;
        }

        console.log("Extracted token:", token);
        console.log("Extracted user:", user);

        if (token) {
          console.log(" Token found, storing...");
          setAuthToken(token);
          
          // Store token timestamp for expiration checking
          if (typeof window !== "undefined") {
            localStorage.setItem("authTokenTimestamp", Date.now().toString());
          }

          const storedToken = getAuthToken();
          console.log(
            "Verified token in storage:",
            storedToken ? "EXISTS" : "MISSING",
          );
        } else {
          console.warn(" No token found in response");
        }

        if (user) {
          console.log(" User data found:", user);
          console.log(" User role:", user.role);

          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(user));
            console.log(" User stored in localStorage");

            const storedUser = localStorage.getItem("user");
            console.log(
              "Verification - Stored user exists:",
              storedUser ? "YES" : "NO",
            );
            if (storedUser) {
              console.log("Verification - Stored user data:", storedUser);
            }
          }

          if (typeof document !== "undefined") {
            const cookieUser = encodeURIComponent(JSON.stringify(user));
            if (token) {
              document.cookie = `authToken=${token}; path=/; max-age=86400; SameSite=Lax`;
            }
            document.cookie = `user=${cookieUser}; path=/; max-age=86400; SameSite=Lax`;
            console.log("Cookies set");
            console.log("All cookies:", document.cookie);
          }
        } else {
          console.error("No user data in response");
        }

        if (token) {
          console.log("Attempting to fetch user profile...");
          try {
            const profileResponse = await apiClient.get<
              ApiResponse<{ user: User }>
            >("/api/users/profile", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            console.log("Profile API Response:", profileResponse.data);

            if (
              profileResponse.data.success &&
              profileResponse.data.data?.user
            ) {
              const profileUser = profileResponse.data.data.user;
              console.log(
                " Profile fetched, updating stored user with complete data",
              );

              if (typeof window !== "undefined") {
                localStorage.setItem("user", JSON.stringify(profileUser));
              }

              if (typeof document !== "undefined") {
                const cookieUser = encodeURIComponent(
                  JSON.stringify(profileUser),
                );
                document.cookie = `user=${cookieUser}; path=/; max-age=86400; SameSite=Lax`;
              }
            }
          } catch (profileError) {
            console.warn(
              " Could not fetch profile (not critical):",
              profileError,
            );
          }
        }
      } else {
        console.error(" Login response not successful");
      }

      return response;
    } catch (error: unknown) {
      console.error(" Login error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { error?: string } };
        };
        if (axiosError.response?.data?.error) {
          throw new Error(axiosError.response.data.error);
        }
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post<{ message: string }>(
        "/api/users/logout",
        {},
      );
      removeAuthToken();
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("authTokenTimestamp");
      }
      return response;
    } catch (error) {
      removeAuthToken();
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("authTokenTimestamp");
      }
      throw error;
    }
  },

  // OTP
  sendOtp: (email: string) =>
    api.post<{ message: string }>("/api/users/otp", { email }),

  verifyOtp: async (data: { email: string; otp: string }) => {
    try {
      console.log("Sending OTP verification request:", data);

      const response = await apiClient.post<ApiResponse<{ message: string }>>(
        "/api/users/verify-otp",
        {
          email: data.email.trim(),
          otp: data.otp.trim(),
        },
      );

      console.log("OTP verification response:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("OTP verification error:", error);

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: { error?: string; message?: string };
            status?: number;
          };
        };

        console.error("Error response:", axiosError.response);
        console.error("Error response data:", axiosError.response?.data);
        console.error("Error response status:", axiosError.response?.status);

        if (axiosError.response?.data) {
          const errorData = axiosError.response.data;
          console.error("Full error data:", JSON.stringify(errorData, null, 2));

          throw new Error(
            errorData.error || errorData.message || "OTP verification failed",
          );
        }

        if (axiosError.response?.status === 500) {
          throw new Error(
            "Server error occurred. The OTP may be incorrect, expired, or there's a database issue. Please try requesting a new OTP.",
          );
        }

        if (axiosError.response?.status === 400) {
          throw new Error("Invalid request. Please check your email and OTP.");
        }

        if (axiosError.response?.status === 404) {
          throw new Error(
            "User or OTP not found. Please register again or request a new OTP.",
          );
        }
      }

      throw new Error("Network error. Please check your connection.");
    }
  },

  updateEmail: (newEmail: string) =>
    api.put<{ message: string }>("/api/users", "update-email", { newEmail }),

  updatePassword: async (data: {
    email: string;
    newPassword: string;
    otp: string;
  }) => {
    try {
      const response = await apiClient.put<
        ApiResponse<{
          message: string;
          user?: User;
        }>
      >("/api/users/update-password", data);
      return response.data;
    } catch (error: unknown) {
      console.error("Update password error:", error);

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: { error?: string; message?: string };
            status?: number;
          };
        };

        if (axiosError.response?.data) {
          throw new Error(
            axiosError.response.data.error ||
              axiosError.response.data.message ||
              "Failed to update password",
          );
        }
      }
      throw error;
    }
  },

  submitCustomerData: async (data: {
    email?: string; // Add email parameter
    firstName: string;
    lastName: string;
    phoneNumber: string;
    countryCode: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    businessInfo: {
      companyName: string;
      businessType: string;
      vatNumber: string;
      websiteUrl?: string;
    };
  }) => {
    try {
      // Try to get token
      const token = getAuthToken();
      console.log("Token check:", token ? "EXISTS" : "MISSING");

      // Prepare headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token && token.trim() !== "") {
        headers["Authorization"] = `Bearer ${token}`;
        console.log(" Adding Authorization header");
      } else {
        console.warn(" No token found, proceeding without auth header");
      }

      console.log(" Submitting customer data:");
      console.log(JSON.stringify(data, null, 2));

      const response = await apiClient.post<
        ApiResponse<{
          message: string;
          user: User;
        }>
      >("/api/users/customer-data", data, { headers });

      console.log(" Response:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error(" Submit error:", error);

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: { error?: string; message?: string };
            status?: number;
          };
        };

        console.error("Status:", axiosError.response?.status);
        console.error("Error data:", axiosError.response?.data);

        // Provide more detailed error message
        const errorMessage =
          axiosError.response?.data?.error ||
          axiosError.response?.data?.message ||
          "Failed to submit customer data";

        console.error("Error message:", errorMessage);
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response =
        await apiClient.get<ApiResponse<{ user: User }>>("/api/users/profile");
      return response.data;
    } catch (error: unknown) {
      console.error("Get profile error:", error);
      throw error;
    }
  },

  // Admin endpoints
  getAllUsers: (params?: FetchParams) =>
    api.get<PaginationData<User>>("/api/users", params),

  getUserById: (id: string) => api.getById<{ user: User }>("/api/users", id),

  createUser: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) => api.post<{ user: User }>("/api/users/create", data),

  updateUser: (id: string, data: object) =>
    api.put<{ user: User }>("/api/users", id, data),

  deleteUser: (id: string) => api.delete<{ message: string }>("/api/users", id),

  searchUsers: (params: { q: string; field?: string }) =>
    api.get<{ users: User[] }>("/api/users/search", params as FetchParams),

  getPendingCustomerData: () =>
    api.get<
      Array<{
        _id: string;
        id?: string;
        email: string;
        username?: string;
        firstName?: string;
        lastName?: string;
        kycStatus?: string;
        status?: string;
        role?: string;
        customerData?: {
          firstName: string;
          lastName: string;
          phoneNumber: string;
          countryCode: string;
          address: {
            street: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
          };
          businessInfo: {
            companyName: string;
            businessType: string;
            vatNumber: string;
            websiteUrl?: string;
          };
          submittedAt?: string;
        };
      }>
    >("/api/users/customer-data-pending"),

  // Get authorized users (approved KYC)
  getAuthorizedUsers: (params?: FetchParams) =>
    api.get<PaginationData<User>>("/api/users", {
      ...params,
      filter: { kycStatus: "approved" },
    }),

  // Approve customer data
  approveCustomerData: async (userId: string) => {
    try {
      const response = await apiClient.post<
        ApiResponse<{
          message: string;
          user: User;
        }>
      >(`/api/users/${userId}/approve-customer-data`, {});
      return response.data;
    } catch (error: unknown) {
      console.error("Approve customer data error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { error?: string; message?: string } };
        };
        if (axiosError.response?.data) {
          throw new Error(
            axiosError.response.data.error ||
              axiosError.response.data.message ||
              "Failed to approve customer data",
          );
        }
      }
      throw error;
    }
  },

  // Reject customer data
  rejectCustomerData: async (userId: string, reason: string) => {
    try {
      const response = await apiClient.post<
        ApiResponse<{
          message: string;
        }>
      >(`/api/users/${userId}/reject-customer-data`, { reason });
      return response.data;
    } catch (error: unknown) {
      console.error("Reject customer data error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { error?: string; message?: string } };
        };
        if (axiosError.response?.data) {
          throw new Error(
            axiosError.response.data.error ||
              axiosError.response.data.message ||
              "Failed to reject customer data",
          );
        }
      }
      throw error;
    }
  },

  // Create admin user (SUPER_ADMIN only)
  createAdmin: async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      const token = getAuthToken();
      if (!token || token.trim() === "") {
        throw new Error("Unauthorized. Please log in.");
      }

      const response = await apiClient.post<
        ApiResponse<{
          message: string;
          user: User;
        }>
      >("/api/users/admin/create", data);
      return response.data;
    } catch (error: unknown) {
      console.error("Create admin error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { error?: string; message?: string } };
        };
        if (axiosError.response?.data) {
          throw new Error(
            axiosError.response.data.error ||
              axiosError.response.data.message ||
              "Failed to create admin",
          );
        }
      }
      throw error;
    }
  },

  // Get all admin users (SUPER_ADMIN only)
  getAdminList: async (params?: { page?: number; limit?: number }) => {
    try {
      const token = getAuthToken();
      if (!token || token.trim() === "") {
        throw new Error("Unauthorized. Please log in.");
      }

      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const queryString = queryParams.toString();
      const endpoint = queryString
        ? `/api/users/admin/list?${queryString}`
        : "/api/users/admin/list";

      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: User[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalRecords: number;
          recordsPerPage: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      }>(endpoint);
      return response.data;
    } catch (error: unknown) {
      console.error("Get admin list error:", error);
      throw error;
    }
  },

  // Delete admin user (SUPER_ADMIN only)
  deleteAdmin: async (adminId: string) => {
    try {
      const token = getAuthToken();
      if (!token || token.trim() === "") {
        throw new Error("Unauthorized. Please log in.");
      }

      console.log("Deleting admin with ID:", adminId);
      console.log("Using token:", token ? "EXISTS" : "MISSING");

      const response = await apiClient.delete<{
        success: boolean;
        message: string;
        data?: unknown;
      }>(`/api/users/admin/${adminId}`);

      console.log("Delete admin response:", response.data);

      return response.data;
    } catch (error: unknown) {
      console.error("Delete admin error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            data?: { error?: string; message?: string; success?: boolean };
          };
        };
        
        console.error("Error response:", axiosError.response);
        
        if (axiosError.response?.data) {
          throw new Error(
            axiosError.response.data.error ||
              axiosError.response.data.message ||
              "Failed to delete admin",
          );
        }
      }
      throw error;
    }
  },
};

// Quotation API endpoints
export const quotationApi = {
  // Submit quotation
  submit: (data: {
    stoneNumbers: string[];
    message: string;
    urgency?: string;
  }) => api.post<{ quotation: Quotation }>("/api/quotations", data),

  // Get all quotations (admin)
  getAll: (params?: { status?: string; userId?: string }) =>
    api.get<{ quotations: Quotation[] }>(
      "/api/quotations",
      params as FetchParams,
    ),

  // Get quotation by ID (admin)
  getById: (quotationId: string) =>
    api.getById<{ quotation: Quotation }>("/api/quotations", quotationId),

  // Approve quotation (admin)
  approve: (
    quotationId: string,
    data: {
      quotedPrice: number;
      validUntil: string;
      notes?: string;
    },
  ) =>
    api.post<{ quotation: Quotation }>(
      `/api/quotations/${quotationId}/approve`,
      data,
    ),

  // Reject quotation (admin)
  reject: (quotationId: string, reason: string) =>
    api.post<{ quotation: Quotation }>(
      `/api/quotations/${quotationId}/reject`,
      { reason },
    ),
};

// Replace the existing blogApi.create method in your api.ts file with this:

export const blogApi = {
  // Get all blogs (Public - non-deleted only) with pagination
  getAll: async (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/api/blogs?${queryString}` : "/api/blogs";

      const response = await apiClient.get<BlogPaginationData>(endpoint);
      return response.data;
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return null;
    }
  },

  // Get single blog by ID (Public)
  getById: async (blogId: string) => {
    try {
      const response = await apiClient.get<BlogResponseSingle>(
        `/api/blogs/${blogId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching blog:", error);
      return null;
    }
  },

  // Admin: Get all blogs (including deleted) with pagination
  getAllAdmin: async (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    try {
      const token = getAuthToken();
      if (!token || token.trim() === "") {
        console.error("Unauthorized. Please log in.");
        return null;
      }

      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const queryString = queryParams.toString();
      const endpoint = queryString
        ? `/api/admin/blogs?${queryString}`
        : "/api/admin/blogs";

      const response = await apiClient.get<BlogPaginationData>(endpoint);
      return response.data;
    } catch (error) {
      console.error("Error fetching admin blogs:", error);
      return null;
    }
  },

  // Admin: Get all blogs without pagination
  getAllAdminNoPagination: async (params?: {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    try {
      const token = getAuthToken();
      if (!token || token.trim() === "") {
        console.error("Unauthorized. Please log in.");
        return null;
      }

      const queryParams = new URLSearchParams();

      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const queryString = queryParams.toString();
      const endpoint = queryString
        ? `/api/admin/blogs/all?${queryString}`
        : "/api/admin/blogs/all";

      const response = await apiClient.get<BlogResponseAll>(endpoint);
      return response.data;
    } catch (error) {
      console.error("Error fetching all admin blogs:", error);
      return null;
    }
  },

  // Admin: Create new blog - UPDATED TO USE CORRECT ENDPOINT
  create: async (data: { title: string; description: string }) => {
    try {
      const token = getAuthToken();
      if (!token || token.trim() === "") {
        throw new Error("Unauthorized. Please log in.");
      }

      console.log("Creating blog with data:", data);

      // Use the correct endpoint: /api/admin/blogs (not /api/admin/blogs/all)
      const response = await apiClient.post<BlogResponseSingle>(
        "/api/admin/blogs",
        data,
      );

      console.log("Blog created successfully:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("Create blog error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { error?: string; message?: string } };
        };
        if (axiosError.response?.data) {
          throw new Error(
            axiosError.response.data.error ||
              axiosError.response.data.message ||
              "Failed to create blog",
          );
        }
      }
      throw error;
    }
  },

  // Admin: Update blog
  update: async (
    blogId: string,
    data: { title?: string; description?: string },
  ) => {
    try {
      const token = getAuthToken();
      if (!token || token.trim() === "") {
        throw new Error("Unauthorized. Please log in.");
      }

      const response = await apiClient.put<BlogResponseSingle>(
        `/api/admin/blogs/${blogId}`,
        data,
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Update blog error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { error?: string; message?: string } };
        };
        if (axiosError.response?.data) {
          throw new Error(
            axiosError.response.data.error ||
              axiosError.response.data.message ||
              "Failed to update blog",
          );
        }
      }
      throw error;
    }
  },

  // Admin: Delete blog
  delete: async (blogId: string) => {
    try {
      const token = getAuthToken();
      if (!token || token.trim() === "") {
        throw new Error("Unauthorized. Please log in.");
      }

      const response = await apiClient.delete<ApiResponse<{ message: string }>>(
        `/api/admin/blogs/${blogId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Delete blog error:", error);
      return null;
    }
  },
};

// Health check
export const healthCheck = () => api.get<{ status: string }>("/health");

// Admin-only endpoints
export const adminApi = {
  // Users
  getAllUsers: (params?: FetchParams) =>
    api.get<PaginationData<User>>("/api/users", params),

  // Carts (admin view of all users' carts)
  getAllCarts: () =>
    api.get<{
      success: boolean;
      carts: Array<{
        cart: {
          userId: string;
          items: Array<{
            stoneNo: string;
            diamond: Diamond;
            addedAt: string;
            _id: string;
          }>;
          _id: string;
          createdAt: string;
          updatedAt: string;
        };
        user: User;
        totalItems: number;
      }>;
    }>("/api/diamonds/cart/admin/all"),

  // Holds with optional status filter: approved | pending | rejected
  getAllHolds: (status?: string) =>
    api.get<{
      success: boolean;
      holds: Array<{
        hold: {
          userId: string;
          items: Array<{
            stoneNo: string;
            diamond: Diamond;
            status: string;
            addedAt: string;
            _id: string;
          }>;
          _id: string;
          createdAt: string;
          updatedAt: string;
        };
        user: User;
        filteredItems?: Array<{
          stoneNo: string;
          diamond: Diamond;
          status: string;
          addedAt: string;
          _id: string;
        }>;
      }>;
    }>(
      "/api/diamonds/hold/admin/all",
      status ? ({ status } as FetchParams) : ({} as FetchParams),
    ),

  // All queries (admin)
  getAllQueries: () =>
    api.get<{
      success: boolean;
      groupedQueries: Array<{
        email: string;
        queries: Array<{
          id: string;
          _id: string;
          userId: string;
          stoneNo: string;
          query: string;
          status: string;
          createdAt: string;
          updatedAt: string;
          adminReply?: string;
          repliedAt?: string;
          diamond?: Diamond;
        }>;
      }>;
    }>("/api/diamonds/queries/admin/all"),

  // Reply to a query
  replyToQuery: async (queryId: string, reply: string) => {
    try {
      const response = await apiClient.put<
        ApiResponse<{
          message: string;
          query: {
            id: string;
            userId: string;
            stoneNo: string;
            query: string;
            status: string;
            adminReply: string;
            repliedAt: string;
          };
        }>
      >(`/api/diamonds/queries/${queryId}/reply`, { reply });
      return response.data;
    } catch (error: unknown) {
      console.error("Reply to query error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { error?: string; message?: string } };
        };
        if (axiosError.response?.data) {
          throw new Error(
            axiosError.response.data.error ||
              axiosError.response.data.message ||
              "Failed to reply to query",
          );
        }
      }
      throw error;
    }
  },

  // Approve/Reject a hold
  approveHold: async (holdId: string) => {
    try {
      const response = await apiClient.put<
        ApiResponse<{
          message: string;
          hold: {
            id: string;
            userId: string;
            items: Array<{
              stoneNo: string;
              status: string;
              _id: string;
            }>;
          };
        }>
      >(`/api/diamonds/hold/${holdId}/approve`, {});
      return response.data;
    } catch (error: unknown) {
      console.error("Approve hold error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { error?: string; message?: string } };
        };
        if (axiosError.response?.data) {
          throw new Error(
            axiosError.response.data.error ||
              axiosError.response.data.message ||
              "Failed to approve hold",
          );
        }
      }
      throw error;
    }
  },
  rejectHold: async (holdId: string) => {
    try {
      const response = await apiClient.put<
        ApiResponse<{
          message: string;
          hold: {
            id: string;
            userId: string;
            items: Array<{
              stoneNo: string;
              status: string;
              _id: string;
            }>;
          };
        }>
      >(`/api/diamonds/hold/${holdId}/reject`, {});
      return response.data;
    } catch (error: unknown) {
      console.error("Reject hold error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { error?: string; message?: string } };
        };
        if (axiosError.response?.data) {
          throw new Error(
            axiosError.response.data.error ||
              axiosError.response.data.message ||
              "Failed to reject hold",
          );
        }
      }
      throw error;
    }
  },

  // Create a hold (what it's for: place an item on hold for a user)
  addHold: (payload: { stoneNo: string; userId?: string }) =>
    api.post<{
      message: string;
      hold: {
        id: string;
        userId: string;
        items: Array<{
          stoneNo: string;
          status: string;
          _id: string;
        }>;
      };
    }>("/api/diamonds/hold/add", payload),
};

// Hold API endpoints
export const holdApi = {
  // Add item to hold
  add: (stoneNo: string) =>
    api.post<{ message: string }>("/api/diamonds/hold/add", { stoneNo }),

  // Get current user's hold items
  get: () =>
    api.get<{
      hold: {
        _id: string;
        userId: string;
        items: Array<{
          stoneNo: string;
          diamond: Diamond;
          status: string;
          addedAt: string;
          _id: string;
          statusUpdatedAt?: string;
          statusUpdatedBy?: string;
          rejectionReason?: string;
        }>;
        createdAt: string;
        updatedAt: string;
      };
      totalItems: number;
    }>("/api/diamonds/hold"),
};

// Query API endpoints
export const queryApi = {
  // Create a query
  create: (data: { stoneNo: string; query: string }) =>
    api.post<{ message: string }>("/api/diamonds/queries", data),

  // Get user's queries
  getUserQueries: async () => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: {
          queries: Array<{
            id: string;
            userId: string;
            userEmail: string;
            stoneNo: string;
            diamond: Diamond;
            query: string;
            status: string;
            createdAt: string;
            updatedAt: string;
            adminReply?: string;
            repliedAt?: string;
            repliedBy?: string;
          }>;
        };
      }>("/api/diamonds/queries");
      return response.data;
    } catch (error) {
      console.error("Error fetching user queries:", error);
      throw error;
    }
  },
};

// Form API endpoints
export const formApi = {
  // Submit sell diamond form (public, no auth required)
  submitSellDiamond: async (formData: FormData) => {
    try {
      const response = await apiClient.post<ApiResponse<{ message: string }>>(
        "/api/forms/submit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Form submission error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { error?: string; message?: string } };
        };
        if (axiosError.response?.data) {
          throw new Error(
            axiosError.response.data.error ||
              axiosError.response.data.message ||
              "Failed to submit form",
          );
        }
      }
      throw error;
    }
  },

  // Get all form submissions grouped by email (Admin)
  getGroupedSubmissions: async (params?: {
    page?: number;
    limit?: number;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      
      const url = queryParams.toString() 
        ? `/api/forms/grouped?${queryParams.toString()}`
        : "/api/forms/grouped";
      
      console.log("Fetching buy form submissions from:", url);
      
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: Array<{
          email: string;
          submissions: Array<{
            _id: string;
            name: string;
            email: string;
            address: string;
            phoneNumber: string;
            countryCode: string;
            carat: number;
            material: string;
            description: string;
            images: Array<{
              fileName: string;
              s3Key: string;
              s3Url: string;
              fileSize: number;
              mimeType: string;
              uploadedAt: string;
            }>;
            status: string;
            createdAt: string;
            updatedAt: string;
          }>;
          totalCount: number;
          lastSubmittedAt: string;
        }>;
        pagination: {
          currentPage: number;
          totalPages: number;
          totalRecords: number;
          recordsPerPage: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      }>(url);
      
      console.log("Buy form submissions response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get grouped submissions error:", error);
      throw error;
    }
  },

  // Update form submission status (Admin)
  updateSubmissionStatus: async (
    submissionId: string,
    status: string,
  ) => {
    try {
      const response = await apiClient.patch<{
        success: boolean;
        message: string;
      }>(`/api/forms/${submissionId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error("Update submission status error:", error);
      throw error;
    }
  },
};

// Export token management functions
export { getAuthToken, setAuthToken, removeAuthToken, isAuthenticated };

// Export types
export type {
  FilterOptions,
  Diamond,
  LimitedEditionDiamond,
  User,
  CartItem,
  Quotation,
  DashboardStats,
  Blog,
  BlogPaginationData,
  BlogResponseAll,
  BlogResponseSingle,
};
// Export API object
const apiExport = {
  api,
  diamondApi,
  cartApi,
  userApi,
  quotationApi,
  blogApi,
  adminApi,
  holdApi,
  queryApi,
  formApi,
  healthCheck,
};

export default apiExport;
