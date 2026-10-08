import { describe, it, expect, vi, beforeEach } from "vitest";
import DetailPage from "./DetailPage.vue";
import * as api from "../api/cashFlowApi";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import { renderWithProviders, flushPromises, ok, fail, Stub } from "../../../test-utils";
import { showConfirmDialog, showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

vi.mock("../api/cashFlowApi");
vi.mock("../../../helpers/toolsHelper", async (orig) => ({
  ...(await orig<any>()),
  showConfirmDialog: vi.fn(),
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

const cf = { id: 5, user_id: 1, type: "outflow", source: "savings", label: "elektronik", description: "Beli mouse", nominal: 400000, created_at: "2024-10-05T12:09:16.000000Z", updated_at: "2024-10-06T12:09:16.000000Z" };
const routes = [{ path: "/cash-flows/:cashFlowId", component: DetailPage }, { path: "/", component: Stub }];
const mountDetail = () => renderWithProviders(DetailPage, { route: "/cash-flows/5", routes });

beforeEach(() => {
  vi.mocked(api.getCashFlow).mockResolvedValue(ok({ cash_flow: cf }) as any);
  vi.mocked(api.getLabels).mockResolvedValue(ok({ labels: ["elektronik"] }) as any);
});

describe("DetailPage", () => {
  it("menampilkan rincian transaksi", async () => {
    const { wrapper } = await mountDetail();
    expect(api.getCashFlow).toHaveBeenCalledWith("5");
    expect(wrapper.get("h1").text()).toContain("elektronik");
    expect(wrapper.text()).toContain("Pengeluaran");
    expect(wrapper.text()).toContain("Tabungan");
    expect(wrapper.text()).toContain("400.000");
    expect(wrapper.text()).toContain("Beli mouse");
  });

  it("menampilkan status memuat", async () => {
    const { wrapper, pinia } = await mountDetail();
    useCashFlowsStore(pinia).isCashFlow = true;
    await flushPromises();
    expect(wrapper.get("[role=status]").text()).toContain("Memuat");
  });

  it("menampilkan h1 dan pesan saat transaksi tidak ditemukan", async () => {
    vi.mocked(api.getCashFlow).mockResolvedValue(fail("Tidak ada") as any);
    const { wrapper } = await mountDetail();
    expect(wrapper.get("h1").text()).toBe("Transaksi tidak ditemukan");
    expect(wrapper.get("[role=alert]").text()).toContain("tidak tersedia");
  });

  it("mengubah transaksi lewat modal lalu memuat ulang", async () => {
    vi.mocked(api.putCashFlow).mockResolvedValue(ok({}, "Diubah") as any);
    const { wrapper } = await mountDetail();
    await wrapper.findAll("button").find((b) => b.text() === "Ubah")!.trigger("click");
    await vi.waitFor(() => expect(wrapper.find("dialog").exists()).toBe(true));
    expect(wrapper.text()).toContain("Ubah Transaksi");
    await wrapper.get("dialog form").trigger("submit");
    await flushPromises();
    expect(api.putCashFlow).toHaveBeenCalledWith(5, expect.objectContaining({ label: "elektronik", nominal: 400000 }));
    expect(vi.mocked(api.getCashFlow).mock.calls.length).toBeGreaterThan(1);
  });

  it("menutup modal ubah", async () => {
    const { wrapper } = await mountDetail();
    await wrapper.findAll("button").find((b) => b.text() === "Ubah")!.trigger("click");
    await vi.waitFor(() => expect(wrapper.find("dialog").exists()).toBe(true));
    await wrapper.get("dialog").trigger("close");
    await flushPromises();
    expect(wrapper.find("dialog").exists()).toBe(false);
  });

  it("hapus: dibatalkan, berhasil, lalu gagal", async () => {
    const { wrapper, router } = await mountDetail();
    const del = () => wrapper.findAll("button").find((b) => b.text() === "Hapus")!;
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(false);
    await del().trigger("click");
    await flushPromises();
    expect(api.deleteCashFlow).not.toHaveBeenCalled();

    vi.mocked(showConfirmDialog).mockResolvedValueOnce(true);
    vi.mocked(api.deleteCashFlow).mockResolvedValueOnce(fail("Tidak bisa") as any);
    await del().trigger("click");
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Tidak bisa");

    vi.mocked(showConfirmDialog).mockResolvedValueOnce(true);
    vi.mocked(api.deleteCashFlow).mockResolvedValueOnce(ok({}, "Dihapus") as any);
    await del().trigger("click");
    await flushPromises();
    expect(api.deleteCashFlow).toHaveBeenLastCalledWith(5);
    expect(showSuccessDialog).toHaveBeenCalledWith("Dihapus");
    expect(router.currentRoute.value.path).toBe("/");
  });
});
