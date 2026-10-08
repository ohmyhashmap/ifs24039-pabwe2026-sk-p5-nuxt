import { describe, it, expect, vi } from "vitest";
import RegisterPage from "./RegisterPage.vue";
import * as api from "../api/authApi";
import { useAuthStore } from "../states/authStore";
import { renderWithProviders, flushPromises, ok, fail, Stub } from "../../../test-utils";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

vi.mock("../api/authApi");
vi.mock("../../../helpers/toolsHelper", async (orig) => ({
  ...(await orig<any>()),
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));
const routes = [{ path: "/auth/login", component: Stub }, { path: "/auth/register", component: RegisterPage }];

async function fill(wrapper: any, name: string, email: string, password: string) {
  await wrapper.get("#register-name-input").setValue(name);
  await wrapper.get("#register-email-input").setValue(email);
  await wrapper.get("#register-password-input").setValue(password);
}

describe("RegisterPage", () => {
  it("menampilkan form pendaftaran", async () => {
    const { wrapper } = await renderWithProviders(RegisterPage, { route: "/auth/register", routes });
    expect(wrapper.get("h1").text()).toBe("Daftar Akun");
    expect(wrapper.find("#register-submit-button").exists()).toBe(true);
  });

  it("menolak data tidak lengkap", async () => {
    const { wrapper } = await renderWithProviders(RegisterPage, { route: "/auth/register", routes });
    await wrapper.get("form").trigger("submit");
    expect(wrapper.get("[role=alert]").text()).toContain("Lengkapi");
    await fill(wrapper, "Erwin", "e@x.id", "123");
    await wrapper.get("form").trigger("submit");
    expect(wrapper.get("[role=alert]").exists()).toBe(true);
    expect(api.postRegister).not.toHaveBeenCalled();
  });

  it("mendaftar lalu mengarahkan ke login", async () => {
    vi.mocked(api.postRegister).mockResolvedValue(ok({}, "Akun dibuat") as any);
    const { wrapper, router } = await renderWithProviders(RegisterPage, { route: "/auth/register", routes });
    await fill(wrapper, "Erwin", "e@x.id", "123456");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    expect(api.postRegister).toHaveBeenCalledWith({ name: "Erwin", email: "e@x.id", password: "123456" });
    expect(showSuccessDialog).toHaveBeenCalledWith("Akun dibuat");
    expect(router.currentRoute.value.path).toBe("/auth/login");
  });

  it("menampilkan dialog error saat gagal", async () => {
    vi.mocked(api.postRegister).mockResolvedValue(fail("Email sudah dipakai") as any);
    const { wrapper } = await renderWithProviders(RegisterPage, { route: "/auth/register", routes });
    await fill(wrapper, "Erwin", "e@x.id", "123456");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Email sudah dipakai");
  });

  it("menonaktifkan tombol saat memproses", async () => {
    const { wrapper, pinia } = await renderWithProviders(RegisterPage, { route: "/auth/register", routes });
    useAuthStore(pinia).isLoading = true;
    await flushPromises();
    expect(wrapper.get("#register-submit-button").text()).toContain("Memproses...");
  });
});
