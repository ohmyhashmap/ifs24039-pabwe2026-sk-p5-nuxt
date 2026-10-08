const TOKEN_KEY = "delcom_token";

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const putAccessToken = (token: string | null) =>
  token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);

/** Wrapper fetch ke REST API Delcom. Selalu mengembalikan { ok, message, data }. */
export interface ApiResult { ok: boolean; message: string; data: any; unauthorized?: boolean }
interface ApiOptions { method?: string; body?: unknown; params?: Record<string, any>; form?: FormData }

export async function apiFetch(path: string, { method = "GET", body, params, form }: ApiOptions = {}): Promise<ApiResult> {
  const url = new URL(DELCOM_BASEURL + path);
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  });
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload: BodyInit | undefined;
  if (form) payload = form;
  else if (body) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  try {
    const res = await fetch(url, { method, headers, body: payload });
    const json = await res.json().catch(() => ({}));
    const ok = res.ok && json.status === "success";
    let message = json.message || (ok ? "Berhasil" : "Terjadi kesalahan");
    const fields = json.data && json.data.field;
    if (!ok && fields) message += ": " + Object.values(fields).flat().join(", ");
    return { ok, message, data: json.data || {}, unauthorized: res.status === 401 };
  } catch {
    return { ok: false, message: "Tidak dapat terhubung ke server", data: {} };
  }
}
