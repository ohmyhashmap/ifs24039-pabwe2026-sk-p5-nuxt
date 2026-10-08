import { describe, it, expect, vi } from "vitest";
import AddModal from "./AddModal.vue";
import CashFlowForm from "../components/CashFlowForm.vue";
import * as api from "../api/cashFlowApi";
import { renderWithProviders, flushPromises, ok, fail } from "../../../test-utils";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

vi.mock("../api/cashFlowApi");
vi.mock("../../../helpers/toolsHelper", async (orig) => ({
  ...(await orig<any>()),
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));
const payload = { type: "inflow", source: "cash", label: "g", description: "d", nominal: 1 };

describe("AddModal", () => {
  it("menyimpan transaksi lalu menutup modal dan memberi tahu parent", async () => {
    vi.mocked(api.postCashFlow).mockResolvedValue(ok({}, "Tersimpan") as any);
    const { wrapper } = await renderWithProviders(AddModal);
    expect(wrapper.text()).toContain("Catat Transaksi Baru");
    wrapper.findComponent(CashFlowForm).vm.$emit("submit", payload);
    await flushPromises();
    expect(api.postCashFlow).toHaveBeenCalledWith(payload);
    expect(showSuccessDialog).toHaveBeenCalledWith("Tersimpan");
    expect(wrapper.emitted("close")).toHaveLength(1);
    expect(wrapper.emitted("saved")).toHaveLength(1);
  });

  it("menampilkan dialog error saat gagal", async () => {
    vi.mocked(api.postCashFlow).mockResolvedValue(fail("Data tidak valid") as any);
    const { wrapper } = await renderWithProviders(AddModal);
    wrapper.findComponent(CashFlowForm).vm.$emit("submit", payload);
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Data tidak valid");
    expect(wrapper.emitted("saved")).toBeUndefined();
  });

  it("menutup modal saat dibatalkan", async () => {
    const { wrapper } = await renderWithProviders(AddModal);
    wrapper.findComponent(CashFlowForm).vm.$emit("cancel");
    await wrapper.get("dialog").trigger("close");
    expect(wrapper.emitted("close")).toHaveLength(2);
  });
});
