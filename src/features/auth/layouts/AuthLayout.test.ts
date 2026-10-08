import { describe, it, expect } from "vitest";
import AuthLayout from "./AuthLayout.vue";
import { renderWithProviders, Stub } from "../../../test-utils";

const routes = [
  { path: "/auth/login", component: Stub },
  { path: "/auth/register", component: Stub },
];

describe("AuthLayout", () => {
  it("menampilkan judul, tab, dan konten rute anak", async () => {
    const { wrapper } = await renderWithProviders(AuthLayout, { route: "/auth/login", routes });
    expect(wrapper.text()).toContain("Delcom Cash Flow");
    expect(wrapper.find("main#main").exists()).toBe(true);
    const tabs = wrapper.findAll("nav a");
    expect(tabs.map((t) => t.text())).toEqual(["Masuk Akun", "Daftar Baru"]);
    expect(tabs[0].attributes("aria-current")).toBe("page");
    expect(tabs[1].attributes("aria-current")).toBeUndefined();
    expect(wrapper.text()).toContain("stub");
  });

  it("menandai tab register saat berada di halaman register", async () => {
    const { wrapper } = await renderWithProviders(AuthLayout, { route: "/auth/register", routes });
    const tabs = wrapper.findAll("nav a");
    expect(tabs[1].attributes("aria-current")).toBe("page");
    expect(tabs[0].attributes("aria-current")).toBeUndefined();
  });
});
