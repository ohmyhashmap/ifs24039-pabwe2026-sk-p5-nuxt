import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthStore } from "./authStore";
import * as api from "../api/authApi";
import { createMockPinia, ok, fail } from "../../../test-utils";
import { getAccessToken, putAccessToken } from "../../../helpers/apiHelper";

vi.mock("../api/authApi");

describe("authStore", () => {
  beforeEach(() => createMockPinia());

  it("membaca token awal dari localStorage", () => {
    putAccessToken("old");
    createMockPinia();
    const s = useAuthStore();
    expect(s.token).toBe("old");
    expect(s.isAuthLogin).toBe(true);
  });

  it("login berhasil menyimpan token", async () => {
    vi.mocked(api.postLogin).mockResolvedValue(ok({ token: "t1" }) as any);
    const s = useAuthStore();
    const res = await s.asyncLogin({ email: "a", password: "b" });
    expect(res.ok).toBe(true);
    expect(s.token).toBe("t1");
    expect(getAccessToken()).toBe("t1");
    expect(s.isAuthLogin).toBe(true);
    expect(s.isLoading).toBe(false);
  });

  it("login gagal tidak menyimpan token", async () => {
    vi.mocked(api.postLogin).mockResolvedValue(fail("salah") as any);
    const s = useAuthStore();
    const res = await s.asyncLogin({});
    expect(res.ok).toBe(false);
    expect(s.token).toBeNull();
    expect(s.isAuthLogin).toBe(false);
  });

  it("register mencatat status berhasil dan gagal", async () => {
    const s = useAuthStore();
    vi.mocked(api.postRegister).mockResolvedValueOnce(ok() as any);
    await s.asyncRegister({});
    expect(s.isAuthRegister).toBe(true);
    vi.mocked(api.postRegister).mockResolvedValueOnce(fail() as any);
    await s.asyncRegister({});
    expect(s.isAuthRegister).toBe(false);
  });

  it("logout menghapus token", async () => {
    putAccessToken("x");
    createMockPinia();
    vi.mocked(api.postLogout).mockResolvedValue(ok() as any);
    const s = useAuthStore();
    await s.asyncLogout();
    expect(s.token).toBeNull();
    expect(getAccessToken()).toBeNull();
    expect(s.isAuthLogout).toBe(true);
  });
});
