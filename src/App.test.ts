import { describe, it, expect } from "vitest";
import App from "./app.vue";
import { renderWithProviders } from "./test-utils";

describe("App", () => {
  it("merender RouterView untuk rute aktif", async () => {
    const { wrapper } = await renderWithProviders(App);
    expect(wrapper.text()).toContain("stub");
  });
  it("berpindah rute tanpa error", async () => {
    const { wrapper, router } = await renderWithProviders(App);
    await router.push("/lain");
    expect(wrapper.text()).toContain("stub");
  });
});
