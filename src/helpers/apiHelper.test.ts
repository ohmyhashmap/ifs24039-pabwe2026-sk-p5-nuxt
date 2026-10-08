import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiFetch, getAccessToken, putAccessToken } from "./apiHelper";

const respond = (body: any, init: { ok?: boolean; status?: number; badJson?: boolean } = {}) =>
  vi.fn().mockResolvedValue({
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: init.badJson ? () => Promise.reject(new Error("bad")) : () => Promise.resolve(body),
  });

describe("token", () => {
  it("menyimpan, membaca, dan menghapus token", () => {
    expect(getAccessToken()).toBeNull();
    putAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
    putAccessToken(null);
    expect(getAccessToken()).toBeNull();
  });
});

describe("apiFetch", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("GET tanpa token, mengabaikan query kosong, dan memakai pesan bawaan", async () => {
    const f = respond({ status: "success", data: { a: 1 } });
    vi.stubGlobal("fetch", f);
    const res = await apiFetch("/x", { params: { a: "1", b: undefined, c: null, d: "" } });
    const [url, opt] = f.mock.calls[0];
    expect(String(url)).toContain("/x?a=1");
    expect(String(url)).not.toContain("b=");
    expect(opt.headers.Authorization).toBeUndefined();
    expect(opt.body).toBeUndefined();
    expect(res).toMatchObject({ ok: true, message: "Berhasil", data: { a: 1 }, unauthorized: false });
  });

  it("mengirim token dan body JSON", async () => {
    putAccessToken("tok");
    const f = respond({ status: "success", message: "Oke", data: {} });
    vi.stubGlobal("fetch", f);
    const res = await apiFetch("/x", { method: "POST", body: { n: 1 } });
    const opt = f.mock.calls[0][1];
    expect(opt.headers.Authorization).toBe("Bearer tok");
    expect(opt.headers["Content-Type"]).toBe("application/json");
    expect(opt.body).toBe('{"n":1}');
    expect(res.message).toBe("Oke");
  });

  it("mengirim FormData apa adanya", async () => {
    const f = respond({ status: "success" });
    vi.stubGlobal("fetch", f);
    const form = new FormData();
    const res = await apiFetch("/x", { method: "POST", form });
    expect(f.mock.calls[0][1].body).toBe(form);
    expect(res.data).toEqual({});
  });

  it("menggabungkan pesan validasi field saat gagal", async () => {
    vi.stubGlobal("fetch", respond({ status: "fail", message: "Data tidak valid", data: { field: { email: ["wajib", "salah"] } } }, { ok: false, status: 422 }));
    const res = await apiFetch("/x");
    expect(res.ok).toBe(false);
    expect(res.message).toBe("Data tidak valid: wajib, salah");
  });

  it("memakai pesan bawaan saat gagal tanpa pesan dan menandai 401", async () => {
    vi.stubGlobal("fetch", respond({ status: "fail" }, { ok: false, status: 401 }));
    const res = await apiFetch("/x");
    expect(res).toMatchObject({ ok: false, message: "Terjadi kesalahan", unauthorized: true });
  });

  it("menangani respons yang bukan JSON", async () => {
    vi.stubGlobal("fetch", respond(null, { ok: false, status: 500, badJson: true }));
    const res = await apiFetch("/x");
    expect(res.ok).toBe(false);
    expect(res.data).toEqual({});
  });

  it("menangani kegagalan jaringan", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const res = await apiFetch("/x");
    expect(res).toEqual({ ok: false, message: "Tidak dapat terhubung ke server", data: {} });
  });
});
