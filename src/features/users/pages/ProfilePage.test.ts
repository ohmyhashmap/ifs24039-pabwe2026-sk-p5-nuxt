import { describe, it, expect, vi } from "vitest";
import ProfilePage from "./ProfilePage.vue";
import * as api from "../api/userApi";
import { renderWithProviders, flushPromises, ok, fail } from "../../../test-utils";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

vi.mock("../api/userApi");
vi.mock("../../../helpers/toolsHelper", async (orig) => ({
  ...(await orig<any>()),
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));
const user = { id: 1, name: "Erwin", email: "e@x.id", photo: "img/profile/1.png" };

describe("ProfilePage", () => {
  it("menampilkan status memuat saat profil belum tersedia", async () => {
    vi.mocked(api.getMe).mockResolvedValue(fail() as any);
    const { wrapper } = await renderWithProviders(ProfilePage);
    expect(wrapper.get("[role=status]").text()).toContain("Memuat profil");
  });

  it("menampilkan data profil dengan foto", async () => {
    vi.mocked(api.getMe).mockResolvedValue(ok({ user }) as any);
    const { wrapper } = await renderWithProviders(ProfilePage);
    expect((wrapper.get("#pname").element as HTMLInputElement).value).toBe("Erwin");
    expect((wrapper.get("#pemail").element as HTMLInputElement).value).toBe("e@x.id");
    expect(wrapper.get("img").attributes("src")).toBe("https://open-api.delcom.org/img/profile/1.png");
  });

  it("memakai inisial saat foto tidak tersedia", async () => {
    vi.mocked(api.getMe).mockResolvedValue(ok({ user: { ...user, photo: null } }) as any);
    const { wrapper } = await renderWithProviders(ProfilePage);
    expect(wrapper.find("img").exists()).toBe(false);
    expect(wrapper.text()).toContain("E");
  });

  it("menyimpan profil: berhasil dan gagal", async () => {
    vi.mocked(api.getMe).mockResolvedValue(ok({ user }) as any);
    vi.mocked(api.putMe).mockResolvedValueOnce(ok({}, "Profil disimpan") as any);
    const { wrapper } = await renderWithProviders(ProfilePage);
    await wrapper.get("#pname").setValue("Baru");
    await wrapper.get("#pemail").setValue("baru@x.id");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    expect(api.putMe).toHaveBeenCalledWith({ name: "Baru", email: "baru@x.id" });
    expect(showSuccessDialog).toHaveBeenCalledWith("Profil disimpan");
    vi.mocked(api.putMe).mockResolvedValueOnce(fail("Email dipakai") as any);
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Email dipakai");
  });

  it("mengunggah foto jika ada berkas dan mengabaikan jika tidak ada", async () => {
    vi.mocked(api.getMe).mockResolvedValue(ok({ user }) as any);
    vi.mocked(api.postPhoto).mockResolvedValue(ok({}, "Foto diganti") as any);
    const { wrapper } = await renderWithProviders(ProfilePage);
    const input = wrapper.get("#photo");
    await input.trigger("change");
    expect(api.postPhoto).not.toHaveBeenCalled();
    const file = new File(["x"], "a.png", { type: "image/png" });
    Object.defineProperty(input.element, "files", { value: [file], configurable: true });
    await input.trigger("change");
    await flushPromises();
    expect(api.postPhoto).toHaveBeenCalledWith(file);
    expect(showSuccessDialog).toHaveBeenCalledWith("Foto diganti");
  });

  it("mengubah kata sandi: berhasil mengosongkan form, gagal menampilkan error", async () => {
    vi.mocked(api.getMe).mockResolvedValue(ok({ user }) as any);
    vi.mocked(api.putPassword).mockResolvedValueOnce(ok({}, "Sandi diubah") as any);
    const { wrapper } = await renderWithProviders(ProfilePage);
    await wrapper.get("#pw1").setValue("lama");
    await wrapper.get("#pw2").setValue("baru123");
    await wrapper.get("#pw3").setValue("baru123");
    const forms = wrapper.findAll("form");
    await forms[1].trigger("submit");
    await flushPromises();
    expect(api.putPassword).toHaveBeenCalledWith({ password: "lama", new_password: "baru123", new_password_confirmation: "baru123" });
    expect((wrapper.get("#pw1").element as HTMLInputElement).value).toBe("");
    expect(showSuccessDialog).toHaveBeenCalledWith("Sandi diubah");
    vi.mocked(api.putPassword).mockResolvedValueOnce(fail("Sandi salah") as any);
    await forms[1].trigger("submit");
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Sandi salah");
  });
});
