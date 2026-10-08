import { apiFetch } from "../../../helpers/apiHelper";

export const getUsers = () => apiFetch("/users");
export const getMe = () => apiFetch("/users/me");
export const putMe = (body) => apiFetch("/users/me", { method: "PUT", body });
export const postPhoto = (file) => {
  const form = new FormData();
  form.append("photo", file);
  return apiFetch("/users/me/photo", { method: "POST", form });
};
export const putPassword = (body) => apiFetch("/users/password", { method: "PUT", body });
