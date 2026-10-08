import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUsersStore } from "./usersStore";
import * as api from "../api/userApi";
import { createMockPinia, ok, fail } from "../../../test-utils";

vi.mock("../api/userApi");

describe("usersStore", () => {
  beforeEach(() => createMockPinia());

  it("asyncGetUsers berhasil, tanpa data, dan gagal", async () => {
    const s = useUsersStore();
    vi.mocked(api.getUsers).mockResolvedValueOnce(ok({ users: [{ id: 1 }] }) as any);
    await s.asyncGetUsers();
    expect(s.users).toHaveLength(1);
    expect(s.isLoading).toBe(false);
    vi.mocked(api.getUsers).mockResolvedValueOnce(ok({}) as any);
    await s.asyncGetUsers();
    expect(s.users).toEqual([]);
    vi.mocked(api.getUsers).mockResolvedValueOnce(fail() as any);
    await s.asyncGetUsers();
    expect(s.users).toEqual([]);
  });

  it("asyncGetProfile", async () => {
    const s = useUsersStore();
    vi.mocked(api.getMe).mockResolvedValueOnce(ok({ user: { name: "a" } }) as any);
    await s.asyncGetProfile();
    expect(s.profile).toEqual({ name: "a" });
    vi.mocked(api.getMe).mockResolvedValueOnce(fail() as any);
    await s.asyncGetProfile();
    expect(s.profile).toEqual({ name: "a" });
  });

  it("asyncUpdateProfile memuat ulang profil hanya saat berhasil", async () => {
    const s = useUsersStore();
    vi.mocked(api.getMe).mockResolvedValue(ok({ user: { name: "b" } }) as any);
    vi.mocked(api.putMe).mockResolvedValueOnce(ok() as any);
    await s.asyncUpdateProfile({});
    expect(api.getMe).toHaveBeenCalledTimes(1);
    vi.mocked(api.putMe).mockResolvedValueOnce(fail() as any);
    await s.asyncUpdateProfile({});
    expect(api.getMe).toHaveBeenCalledTimes(1);
  });

  it("asyncChangePhoto memuat ulang profil hanya saat berhasil", async () => {
    const s = useUsersStore();
    vi.mocked(api.getMe).mockResolvedValue(ok({ user: {} }) as any);
    vi.mocked(api.postPhoto).mockResolvedValueOnce(ok() as any);
    await s.asyncChangePhoto(new File(["x"], "a.png"));
    expect(api.getMe).toHaveBeenCalledTimes(1);
    vi.mocked(api.postPhoto).mockResolvedValueOnce(fail() as any);
    await s.asyncChangePhoto(new File(["x"], "a.png"));
    expect(api.getMe).toHaveBeenCalledTimes(1);
  });

  it("asyncChangePassword meneruskan hasil API", async () => {
    vi.mocked(api.putPassword).mockResolvedValue(ok() as any);
    const res = await useUsersStore().asyncChangePassword({ password: "1" });
    expect(res.ok).toBe(true);
  });
});
