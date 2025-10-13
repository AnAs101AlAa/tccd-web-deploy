import { systemApi } from "../AxoisInstance";
import type { LoginCredentials, SignupCredentials } from "./types";

const AUTH_ROUTE = "/v1/Auth/";

export class AuthApi {
  async login(credentials: LoginCredentials) {
    const { data } = await systemApi.post(AUTH_ROUTE + "login", credentials);
    return data;
  }

  async logout() {
    const { data } = await systemApi.post(AUTH_ROUTE + "logout");
    return data;
  }

  async signup(credentials: SignupCredentials) {
    const { data } = await systemApi.post(AUTH_ROUTE + "sign-up", credentials);
    return data;
  }
}
