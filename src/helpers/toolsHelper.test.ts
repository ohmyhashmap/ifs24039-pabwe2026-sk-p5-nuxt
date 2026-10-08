import { describe, it, expect, vi } from "vitest";
import Swal from "sweetalert2";
import {
  showSuccessDialog, showErrorDialog, showConfirmDialog, formatRupiah, parseDate, formatDate, toApiDate, photoSrc, initialOf,
} from "./toolsHelper";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));
const fire = vi.mocked(Swal.fire) as any;

describe("dialog", () => {
  it("showSuccessDialog dan showErrorDialog memakai ikon yang sesuai", async () => {
    fire.mockResolvedValue({});
    await showSuccessDialog("ok");
    await showErrorDialog("gagal");
    expect(fire.mock.calls[0][0]).toMatchObject({ icon: "success", text: "ok", color: "#0f172a" });
    expect(fire.mock.calls[1][0]).toMatchObject({ icon: "error", text: "gagal" });
  });

  it("showConfirmDialog mengembalikan status konfirmasi dan teks tombol", async () => {
    fire.mockResolvedValueOnce({ isConfirmed: true });
    expect(await showConfirmDialog("hapus?")).toBe(true);
    expect(fire.mock.calls[0][0].confirmButtonText).toBe("Ya, lanjutkan");
    fire.mockResolvedValueOnce({ isConfirmed: false });
    expect(await showConfirmDialog("hapus?", "Ya, hapus")).toBe(false);
    expect(fire.mock.calls[1][0].confirmButtonText).toBe("Ya, hapus");
  });
});

describe("format", () => {
  it("formatRupiah", () => {
    expect(formatRupiah(1500000)).toContain("1.500.000");
    expect(formatRupiah(undefined as any)).toContain("0");
  });
  it("parseDate dan formatDate", () => {
    expect(parseDate("2024-10-05 10:00:00").getFullYear()).toBe(2024);
    expect(formatDate(undefined)).toBe("-");
    expect(formatDate("2024-10-05T12:09:16.000000Z")).toContain("2024");
  });
  it("toApiDate", () => {
    expect(toApiDate("")).toBe("");
    expect(toApiDate("2024-10-05")).toBe("2024-10-05 00:00:00");
    expect(toApiDate("2024-10-05", true)).toBe("2024-10-05 23:59:59");
  });
});

describe("foto", () => {
  it("photoSrc", () => {
    expect(photoSrc(null)).toBeNull();
    expect(photoSrc("https://x.id/a.png")).toBe("https://x.id/a.png");
    expect(photoSrc("http://127.0.0.1:8000/a.png")).toBeNull();
    expect(photoSrc("img/profile/a.png")).toBe("https://open-api.delcom.org/img/profile/a.png");
    expect(photoSrc("/img/a.png")).toBe("https://open-api.delcom.org/img/a.png");
  });
  it("initialOf", () => {
    expect(initialOf(undefined)).toBe("?");
    expect(initialOf("   ")).toBe("?");
    expect(initialOf("erwin")).toBe("E");
  });
});
