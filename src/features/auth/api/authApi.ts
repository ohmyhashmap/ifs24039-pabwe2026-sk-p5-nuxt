import { apiFetch } from "../../../helpers/apiHelper";

export const postLogin = (body) => apiFetch("/auth/login", { method: "POST", body });
export const postRegister = (body) => apiFetch("/auth/register", { method: "POST", body });
export const postLogout = () => apiFetch("/auth/logout", { method: "POST" });
