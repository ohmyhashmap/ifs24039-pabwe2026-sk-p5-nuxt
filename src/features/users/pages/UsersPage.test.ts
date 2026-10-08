import { describe, it, expect, vi } from "vitest";
import UsersPage from "./UsersPage.vue";
import { useUsersStore } from "../states/usersStore";
import * as api from "../api/userApi";
import { renderWithProviders, flushPromises, ok } from "../../../test-utils";

vi.mock("../api/userApi");

describe("UsersPage", () => {
  it("menampilkan daftar pengguna dengan foto atau inisial", async () => {
    vi.mocked(api.getUsers).mockResolvedValue(ok({ users: [
      { id: 1, name: "Ani", email: "ani@x.id", photo: "https://x.id/a.png" },
      { id: 2, name: "Budi", email: "budi@x.id", photo: "http://127.0.0.1:8000/default/img/user.png" },
    ] }) as any);
    const { wrapper } = await renderWithProviders(UsersPage);
    expect(wrapper.get("h1").text()).toBe("Daftar Pengguna");
    expect(wrapper.findAll("li")).toHaveLength(2);
    expect(wrapper.findAll("img")).toHaveLength(1);
    expect(wrapper.get("img").attributes("alt")).toBe("Foto Ani");
    expect(wrapper.text()).toContain("B");
    expect(wrapper.text()).toContain("budi@x.id");
  });

  it("menampilkan status memuat", async () => {
    vi.mocked(api.getUsers).mockResolvedValue(ok({ users: [] }) as any);
    const { wrapper, pinia } = await renderWithProviders(UsersPage);
    useUsersStore(pinia).isLoading = true;
    await flushPromises();
    expect(wrapper.get("[role=status]").text()).toContain("Memuat");
  });
});
