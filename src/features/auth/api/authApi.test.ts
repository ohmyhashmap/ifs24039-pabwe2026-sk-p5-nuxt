import { describe, it, expect, vi } from "vitest";
import { postLogin, postRegister, postLogout } from "./authApi";
import { apiFetch } from "../../../helpers/apiHelper";

vi.mock("../../../helpers/apiHelper", () => ({ apiFetch: vi.fn().mockResolvedValue({ ok: true }) }));

describe("authApi", () => {
  it("memanggil endpoint login, register, dan logout", async () => {
    await postLogin({ email: "a" });
    await postRegister({ name: "n" });
    await postLogout();
    expect(apiFetch).toHaveBeenNthCalledWith(1, "/auth/login", { method: "POST", body: { email: "a" } });
    expect(apiFetch).toHaveBeenNthCalledWith(2, "/auth/register", { method: "POST", body: { name: "n" } });
    expect(apiFetch).toHaveBeenNthCalledWith(3, "/auth/logout", { method: "POST" });
  });
});
