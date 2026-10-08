import { describe, it, expect, vi, beforeEach } from "vitest";
import HomePage from "./HomePage.vue";
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

const rows = [
  { id: 1, type: "inflow", source: "cash", label: "gaji", description: "d", nominal: 2500000, created_at: "2024-10-05T11:26:45.000000Z", updated_at: "2024-10-05T11:26:45.000000Z" },
  { id: 2, type: "outflow", source: "savings", label: "elektronik", description: "d", nominal: 400000, created_at: "2024-10-05T12:09:16.000000Z", updated_at: "2024-10-05T12:09:16.000000Z" },
];
const stats = { cashflow: 2100000, total_inflow: 2500000, total_outflow: 400000, total_inflow_cash: 2500000, total_outflow_savings: 400000 };
const routes = [{ path: "/", component: HomePage }, { path: "/cash-flows/:id", component: Stub }];

beforeEach(() => {
  vi.mocked(api.getCashFlows).mockResolvedValue(ok({ cash_flows: rows, stats }) as any);
  vi.mocked(api.getLabels).mockResolvedValue(ok({ labels: ["gaji", "elektronik"] }) as any);
});

const mountHome = () => renderWithProviders(HomePage, { routes });

describe("HomePage - tampilan", () => {
  it("menampilkan kartu ringkasan, filter, dan tabel transaksi", async () => {
    const { wrapper } = await mountHome();
    expect(wrapper.get("h1").text()).toBe("Ringkasan Arus Kas");
    expect(wrapper.findAll("section ul > li")).toHaveLength(6);
    expect(wrapper.text()).toContain("Total Saldo Kas Bersih");
    expect(wrapper.text()).toContain("2.100.000");
    expect(wrapper.text()).toContain("-");
    expect(wrapper.findAll("tbody tr")).toHaveLength(2);
    expect(wrapper.text()).toContain("Pemasukan");
    expect(wrapper.text()).toContain("Pengeluaran");
    expect(wrapper.text()).toContain("Tabungan");
    expect(wrapper.findAll("#f-label option")).toHaveLength(3);
    expect(wrapper.findAll("p.text-red-800").length).toBeGreaterThan(0);
  });

  it("menampilkan status kosong dan memuat", async () => {
    vi.mocked(api.getCashFlows).mockResolvedValue(ok({ cash_flows: [], stats: {} }) as any);
    const { wrapper, pinia } = await mountHome();
    expect(wrapper.text()).toContain("Belum ada transaksi");
    useCashFlowsStore(pinia).isCashFlow = true;
    await flushPromises();
    expect(wrapper.text()).toContain("Memuat transaksi");
  });
});

describe("HomePage - filter", () => {
  it("menerapkan dan mengatur ulang filter", async () => {
    const { wrapper } = await mountHome();
    await wrapper.get("#f-type").setValue("inflow");
    await wrapper.get("#f-source").setValue("cash");
    await wrapper.get("#f-label").setValue("gaji");
    await wrapper.get("#f-start").setValue("2024-10-01");
    await wrapper.get("#f-end").setValue("2024-10-31");
    await wrapper.get("form").trigger("submit");
    expect(api.getCashFlows).toHaveBeenLastCalledWith({
      type: "inflow", source: "cash", label: "gaji", start_date: "2024-10-01 00:00:00", end_date: "2024-10-31 23:59:59",
    });
    await wrapper.findAll("form button").find((b) => b.text() === "Atur ulang")!.trigger("click");
    expect(api.getCashFlows).toHaveBeenLastCalledWith({ type: "", source: "", label: "", start_date: "", end_date: "" });
    expect((wrapper.get("#f-type").element as HTMLSelectElement).value).toBe("");
  });
});

describe("HomePage - modal", () => {
  it("membuka modal tambah lalu memuat ulang setelah tersimpan", async () => {
    vi.mocked(api.postCashFlow).mockResolvedValue(ok({}, "Tersimpan") as any);
    const { wrapper } = await mountHome();
    await wrapper.findAll("button").find((b) => b.text().includes("Tambah transaksi"))!.trigger("click");
    await vi.waitFor(() => expect(wrapper.find("dialog").exists()).toBe(true));
    expect(wrapper.text()).toContain("Catat Transaksi Baru");
    const calls = vi.mocked(api.getCashFlows).mock.calls.length;
    await wrapper.get("#add-label").setValue("x");
    await wrapper.get("#add-nominal").setValue("100");
    await wrapper.get("#add-desc").setValue("d");
    await wrapper.get("dialog form").trigger("submit");
    await flushPromises();
    expect(api.postCashFlow).toHaveBeenCalled();
    expect(vi.mocked(api.getCashFlows).mock.calls.length).toBeGreaterThan(calls);
    expect(wrapper.text()).not.toContain("Catat Transaksi Baru");
  });

  it("membuka modal ubah lalu menutupnya", async () => {
    const { wrapper } = await mountHome();
    await wrapper.findAll("tbody button").find((b) => b.text().startsWith("Ubah"))!.trigger("click");
    await vi.waitFor(() => expect(wrapper.find("dialog").exists()).toBe(true));
    expect(wrapper.text()).toContain("Ubah Transaksi");
    expect((wrapper.get("#chg-label").element as HTMLInputElement).value).toBe("gaji");
    await wrapper.get("dialog").trigger("close");
    await flushPromises();
    expect(wrapper.text()).not.toContain("Ubah Transaksi");
  });

  it("menutup modal tambah saat dibatalkan", async () => {
    const { wrapper } = await mountHome();
    await wrapper.findAll("button").find((b) => b.text().includes("Tambah transaksi"))!.trigger("click");
    await vi.waitFor(() => expect(wrapper.find("dialog").exists()).toBe(true));
    await wrapper.get("dialog").trigger("close");
    await flushPromises();
    expect(wrapper.find("dialog").exists()).toBe(false);
  });
});

describe("HomePage - hapus", () => {
  const delBtn = (w: any) => w.findAll("tbody button").find((b: any) => b.text().startsWith("Hapus"))!;
  const resetBtn = (w: any) => w.findAll("button").find((b: any) => b.text().includes("Reset semua"))!;

  it("tidak menghapus jika dibatalkan", async () => {
    vi.mocked(showConfirmDialog).mockResolvedValue(false);
    const { wrapper } = await mountHome();
    await delBtn(wrapper).trigger("click");
    await resetBtn(wrapper).trigger("click");
    await flushPromises();
    expect(api.deleteCashFlow).not.toHaveBeenCalled();
    expect(api.deleteAllCashFlows).not.toHaveBeenCalled();
  });

  it("menghapus satu transaksi: berhasil lalu gagal", async () => {
    vi.mocked(showConfirmDialog).mockResolvedValue(true);
    vi.mocked(api.deleteCashFlow).mockResolvedValueOnce(ok({}, "Dihapus") as any);
    const { wrapper } = await mountHome();
    await delBtn(wrapper).trigger("click");
    await flushPromises();
    expect(api.deleteCashFlow).toHaveBeenCalledWith(1);
    expect(showSuccessDialog).toHaveBeenCalledWith("Dihapus");
    vi.mocked(api.deleteCashFlow).mockResolvedValueOnce(fail("Tidak bisa") as any);
    await delBtn(wrapper).trigger("click");
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Tidak bisa");
  });

  it("mereset seluruh transaksi: berhasil lalu gagal", async () => {
    vi.mocked(showConfirmDialog).mockResolvedValue(true);
    vi.mocked(api.deleteAllCashFlows).mockResolvedValueOnce(ok({}, "Semua dihapus") as any);
    const { wrapper } = await mountHome();
    await resetBtn(wrapper).trigger("click");
    await flushPromises();
    expect(showSuccessDialog).toHaveBeenCalledWith("Semua dihapus");
    vi.mocked(api.deleteAllCashFlows).mockResolvedValueOnce(fail("Gagal reset") as any);
    await resetBtn(wrapper).trigger("click");
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Gagal reset");
  });
});
