import { describe, it, expect } from "vitest";
import NotFoundPage from "./NotFoundPage.vue";
import { renderWithProviders } from "../../../test-utils";

describe("NotFoundPage", () => {
  it("menampilkan halaman 404 dengan tautan kembali", async () => {
    const { wrapper } = await renderWithProviders(NotFoundPage);
    expect(wrapper.get("h1").text()).toBe("Halaman tidak ditemukan");
    expect(wrapper.get("a").attributes("href")).toBe("/");
    expect(wrapper.find("main").exists()).toBe(true);
  });
});
