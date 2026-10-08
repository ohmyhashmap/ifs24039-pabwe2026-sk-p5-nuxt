import { describe, it, expect, vi } from "vitest";
import CashFlowLayout from "./CashFlowLayout.vue";
import * as userApi from "../../users/api/userApi";
import * as authApi from "../../auth/api/authApi";
import { renderWithProviders, flushPromises, ok, fail, Stub } from "../../../test-utils";
import { getAccessToken, putAccessToken } from "../../../helpers/apiHelper";

vi.mock("../../users/api/userApi");
vi.mock("../../auth/api/authApi");
const routes = [{ path: "/", component: Stub }, { path: "/auth/login", component: Stub }];

describe("CashFlowLayout", () => {
  it("menampilkan navbar, sidebar, dan konten utama dengan profil pengguna", async () => {
    vi.mocked(userApi.getMe).mockResolvedValue(ok({ user: { name: "Erwin", email: "e@x.id" } }) as any);
    const { wrapper } = await renderWithProviders(CashFlowLayout, { routes });
    expect(wrapper.text()).toContain("Erwin");
    expect(wrapper.text()).toContain("e@x.id");
    expect(wrapper.find("nav#sidebar").exists()).toBe(true);
    expect(wrapper.find("main#main").exists()).toBe(true);
    expect(wrapper.text()).toContain("stub");
  });

  it("membuka dan menutup sidebar di layar kecil", async () => {
    vi.mocked(userApi.getMe).mockResolvedValue(ok({ user: { name: "E", email: "e" } }) as any);
    const { wrapper } = await renderWithProviders(CashFlowLayout, { routes });
    expect(wrapper.get("nav#sidebar").classes()).toContain("hidden");
    await wrapper.get("button[aria-controls=sidebar]").trigger("click");
    expect(wrapper.get("nav#sidebar").classes()).toContain("block");
    await wrapper.get("nav#sidebar a").trigger("click");
    expect(wrapper.get("nav#sidebar").classes()).toContain("hidden");
  });

  it("logout otomatis saat sesi tidak sah dan memakai nilai bawaan", async () => {
    putAccessToken("expired");
    vi.mocked(userApi.getMe).mockResolvedValue(fail("Unauthenticated", true) as any);
    vi.mocked(authApi.postLogout).mockResolvedValue(ok() as any);
    const { wrapper, router } = await renderWithProviders(CashFlowLayout, { routes });
    expect(authApi.postLogout).toHaveBeenCalled();
    expect(getAccessToken()).toBeNull();
    expect(router.currentRoute.value.path).toBe("/auth/login");
    expect(wrapper.text()).toContain("Pengguna");
  });

  it("tombol keluar memanggil logout", async () => {
    vi.mocked(userApi.getMe).mockResolvedValue(ok({ user: { name: "E", email: "e" } }) as any);
    vi.mocked(authApi.postLogout).mockResolvedValue(ok() as any);
    const { wrapper, router } = await renderWithProviders(CashFlowLayout, { routes });
    const buttons = wrapper.findAll("header button");
    await buttons[buttons.length - 1].trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.path).toBe("/auth/login");
  });
});
