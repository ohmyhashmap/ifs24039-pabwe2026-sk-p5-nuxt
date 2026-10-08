import { describe, it, expect } from "vitest";
import SidebarComponent from "./SidebarComponent.vue";
import { renderWithProviders } from "../../../test-utils";

describe("SidebarComponent", () => {
  it("menampilkan tiga menu dan menandai menu aktif", async () => {
    const { wrapper } = await renderWithProviders(SidebarComponent, { route: "/users", props: { open: true } });
    const links = wrapper.findAll("a");
    expect(links.map((l) => l.text())).toEqual(["Ringkasan Arus Kas", "Direktori Pengguna", "Profil Saya"]);
    expect(links[1].attributes("aria-current")).toBe("page");
    expect(wrapper.get("nav").classes()).toContain("block");
  });

  it("tersembunyi saat tertutup dan mengirim navigate saat menu diklik", async () => {
    const { wrapper } = await renderWithProviders(SidebarComponent);
    expect(wrapper.get("nav").classes()).toContain("hidden");
    await wrapper.get("a").trigger("click");
    expect(wrapper.emitted("navigate")).toHaveLength(1);
  });
});
