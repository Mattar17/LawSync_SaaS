import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "accessToken";
const JWT_LEGACY_KEY = "jwt";
const REFRESH_TOKEN_KEY = "refreshToken";

export const authStorage = {
  getAccessToken: (): string | null => {
    return (
      Cookies.get(ACCESS_TOKEN_KEY) ||
      Cookies.get(JWT_LEGACY_KEY) ||
      localStorage.getItem(ACCESS_TOKEN_KEY) ||
      null
    );
  },

  getRefreshToken: (): string | null => {
    return (
      Cookies.get(REFRESH_TOKEN_KEY) ||
      localStorage.getItem(REFRESH_TOKEN_KEY) ||
      null
    );
  },

  getTokens: () => {
    return {
      accessToken: authStorage.getAccessToken(),
      refreshToken: authStorage.getRefreshToken(),
    };
  },

  saveTokens: (accessToken: string, refreshToken?: string | null) => {
    if (accessToken) {
      Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 30, sameSite: "lax" });
      Cookies.set(JWT_LEGACY_KEY, accessToken, { expires: 30, sameSite: "lax" });
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    }
    if (refreshToken) {
      Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 30, sameSite: "lax" });
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  clearTokens: () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(JWT_LEGACY_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

