import { describe, it, expect } from "vitest";
import CashFlowForm from "./CashFlowForm.vue";
import { renderWithProviders } from "../../../test-utils";

const base = { labels: ["gaji", "makan"], busy: false, submitText: "Simpan", prefix: "t" };

describe("CashFlowForm", () => {
  it("memakai nilai awal bawaan dan mengirim payload bernominal angka", async () => {
    const { wrapper } = await renderWithProviders(CashFlowForm, { props: base });
    expect((wrapper.get("#t-type").element as HTMLSelectElement).value).toBe("inflow");
    expect((wrapper.get("#t-source").element as HTMLSelectElement).value).toBe("cash");
    expect(wrapper.findAll("datalist option")).toHaveLength(2);
    await wrapper.get("#t-label").setValue("gaji");
    await wrapper.get("#t-nominal").setValue("2500");
    await wrapper.get("#t-desc").setValue("bulanan");
    await wrapper.get("#t-type").setValue("outflow");
    await wrapper.get("#t-source").setValue("savings");
    await wrapper.get("form").trigger("submit");
    expect(wrapper.emitted("submit")![0][0]).toEqual({ type: "outflow", source: "savings", label: "gaji", nominal: 2500, description: "bulanan" });
  });

  it("memakai nilai awal dari props", async () => {
    const initial = { type: "outflow", source: "loans", label: "x", description: "d", nominal: 900 };
    const { wrapper } = await renderWithProviders(CashFlowForm, { props: { ...base, initial } });
    expect((wrapper.get("#t-type").element as HTMLSelectElement).value).toBe("outflow");
    expect((wrapper.get("#t-nominal").element as HTMLInputElement).value).toBe("900");
    expect((wrapper.get("#t-label").element as HTMLInputElement).value).toBe("x");
  });

  it("tombol batal mengirim cancel dan busy menonaktifkan simpan", async () => {
    const { wrapper } = await renderWithProviders(CashFlowForm, { props: { ...base, busy: true } });
    await wrapper.get("button[type=button]").trigger("click");
    expect(wrapper.emitted("cancel")).toHaveLength(1);
    expect(wrapper.get("button[type=submit]").attributes("disabled")).toBeDefined();
  });
});
