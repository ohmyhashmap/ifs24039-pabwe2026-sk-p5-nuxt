import { describe, it, expect, vi } from "vitest";
import ChangeModal from "./ChangeModal.vue";
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
const cashFlow = { id: 7, type: "inflow", source: "cash", label: "gaji", description: "d", nominal: 100 };

describe("ChangeModal", () => {
  it("menampilkan data awal dan menyimpan perubahan", async () => {
    vi.mocked(api.putCashFlow).mockResolvedValue(ok({}, "Diubah") as any);
    const { wrapper } = await renderWithProviders(ChangeModal, { props: { cashFlow } });
    expect(wrapper.text()).toContain("Ubah Transaksi");
    expect((wrapper.get("#chg-label").element as HTMLInputElement).value).toBe("gaji");
    wrapper.findComponent(CashFlowForm).vm.$emit("submit", { ...cashFlow, nominal: 200 });
    await flushPromises();
    expect(api.putCashFlow).toHaveBeenCalledWith(7, { ...cashFlow, nominal: 200 });
    expect(showSuccessDialog).toHaveBeenCalledWith("Diubah");
    expect(wrapper.emitted("close")).toHaveLength(1);
    expect(wrapper.emitted("saved")).toHaveLength(1);
  });

  it("menampilkan dialog error saat gagal dan menutup saat dibatalkan", async () => {
    vi.mocked(api.putCashFlow).mockResolvedValue(fail("Gagal ubah") as any);
    const { wrapper } = await renderWithProviders(ChangeModal, { props: { cashFlow } });
    const form = wrapper.findComponent(CashFlowForm);
    form.vm.$emit("submit", cashFlow);
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Gagal ubah");
    form.vm.$emit("cancel");
    expect(wrapper.emitted("close")).toHaveLength(1);
  });
});
