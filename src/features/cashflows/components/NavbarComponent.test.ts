import { describe, it, expect } from "vitest";
import NavbarComponent from "./NavbarComponent.vue";
import { renderWithProviders } from "../../../test-utils";

describe("NavbarComponent", () => {
  it("menampilkan nama dan username pengguna", async () => {
    const { wrapper } = await renderWithProviders(NavbarComponent, { props: { name: "Erwin", username: "e@x.id", open: true } });
    expect(wrapper.text()).toContain("Erwin");
    expect(wrapper.text()).toContain("e@x.id");
    expect(wrapper.get("header span[aria-hidden=true]").text()).toBe("E");
    expect(wrapper.get("button[aria-controls=sidebar]").attributes("aria-expanded")).toBe("true");
  });

  it("memakai nilai bawaan tanpa username", async () => {
    const { wrapper } = await renderWithProviders(NavbarComponent);
    expect(wrapper.text()).toContain("Pengguna");
    expect(wrapper.text()).not.toContain("@");
  });

  it("mengirim event toggle dan logout", async () => {
    const { wrapper } = await renderWithProviders(NavbarComponent);
    await wrapper.get("button[aria-controls=sidebar]").trigger("click");
    const buttons = wrapper.findAll("button");
    await buttons[buttons.length - 1].trigger("click");
    expect(wrapper.emitted("toggle")).toHaveLength(1);
    expect(wrapper.emitted("logout")).toHaveLength(1);
  });
});
