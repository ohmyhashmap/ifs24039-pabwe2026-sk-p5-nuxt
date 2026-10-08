import { describe, it, expect, vi } from "vitest";
import { getUsers, getMe, putMe, postPhoto, putPassword } from "./userApi";
import { apiFetch } from "../../../helpers/apiHelper";

vi.mock("../../../helpers/apiHelper", () => ({ apiFetch: vi.fn().mockResolvedValue({ ok: true }) }));

describe("userApi", () => {
  it("memanggil endpoint pengguna", async () => {
    await getUsers();
    await getMe();
    await putMe({ name: "n" });
    await putPassword({ password: "1" });
    expect(apiFetch).toHaveBeenNthCalledWith(1, "/users");
    expect(apiFetch).toHaveBeenNthCalledWith(2, "/users/me");
    expect(apiFetch).toHaveBeenNthCalledWith(3, "/users/me", { method: "PUT", body: { name: "n" } });
    expect(apiFetch).toHaveBeenNthCalledWith(4, "/users/password", { method: "PUT", body: { password: "1" } });
  });
  it("mengunggah foto lewat FormData", async () => {
    const file = new File(["x"], "a.png", { type: "image/png" });
    await postPhoto(file);
    const [path, opt] = vi.mocked(apiFetch).mock.calls[0] as any;
    expect(path).toBe("/users/me/photo");
    expect(opt.method).toBe("POST");
    expect(opt.form.get("photo")).toBeInstanceOf(File);
  });
});
