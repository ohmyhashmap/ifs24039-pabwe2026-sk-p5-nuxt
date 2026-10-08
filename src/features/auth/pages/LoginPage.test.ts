import { describe, it, expect, vi } from "vitest";
import LoginPage from "./LoginPage.vue";
import * as api from "../api/authApi";
import { useAuthStore } from "../states/authStore";
import { renderWithProviders, flushPromises, ok, fail, Stub } from "../../../test-utils";
import { showErrorDialog } from "../../../helpers/toolsHelper";

vi.mock("../api/authApi");
vi.mock("../../../helpers/toolsHelper", async (orig) => ({
  ...(await orig<any>()),
  showErrorDialog: vi.fn(),
}));
const routes = [{ path: "/", component: Stub }, { path: "/auth/login", component: LoginPage }];

async function fill(wrapper: any, email: string, password: string) {
  await wrapper.get("#login-email-input").setValue(email);
  await wrapper.get("#login-password-input").setValue(password);
}

describe("LoginPage", () => {
  it("memiliki selector yang dipakai grader", async () => {
    const { wrapper } = await renderWithProviders(LoginPage, { route: "/auth/login", routes });
    expect(wrapper.find("#login-email-input").exists()).toBe(true);
    expect(wrapper.find("#login-password-input").exists()).toBe(true);
    expect(wrapper.find("#login-submit-button").exists()).toBe(true);
    expect(wrapper.get("h1").text()).toBe("Masuk Akun");
  });

  it("menampilkan pesan validasi saat form kosong", async () => {
    const { wrapper } = await renderWithProviders(LoginPage, { route: "/auth/login", routes });
    await wrapper.get("form").trigger("submit");
    expect(wrapper.get("[role=alert]").text()).toContain("wajib diisi");
    expect(api.postLogin).not.toHaveBeenCalled();
  });

  it("login berhasil lalu berpindah ke beranda", async () => {
    vi.mocked(api.postLogin).mockResolvedValue(ok({ token: "t" }) as any);
    const { wrapper, router } = await renderWithProviders(LoginPage, { route: "/auth/login", routes });
    await fill(wrapper, "a@b.c", "123456");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    expect(api.postLogin).toHaveBeenCalledWith({ email: "a@b.c", password: "123456" });
    expect(router.currentRoute.value.path).toBe("/");
  });

  it("menampilkan dialog error saat login gagal", async () => {
    vi.mocked(api.postLogin).mockResolvedValue(fail("Email atau kata sandi salah") as any);
    const { wrapper, router } = await renderWithProviders(LoginPage, { route: "/auth/login", routes });
    await fill(wrapper, "a@b.c", "x");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Email atau kata sandi salah");
    expect(router.currentRoute.value.path).toBe("/auth/login");
  });

  it("menonaktifkan tombol saat memproses", async () => {
    const { wrapper, pinia } = await renderWithProviders(LoginPage, { route: "/auth/login", routes });
    useAuthStore(pinia).isLoading = true;
    await flushPromises();
    const btn = wrapper.get("#login-submit-button");
    expect(btn.text()).toContain("Memproses...");
    expect(btn.attributes("disabled")).toBeDefined();
  });
});
