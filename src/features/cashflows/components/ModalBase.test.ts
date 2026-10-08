import { describe, it, expect } from "vitest";
import ModalBase from "./ModalBase.vue";
import { renderWithProviders } from "../../../test-utils";

describe("ModalBase", () => {
  it("membuka dialog modal dan menampilkan judul serta slot", async () => {
    const { wrapper } = await renderWithProviders(ModalBase, { props: { title: "Judul" }, slots: { default: "<p>isi</p>" } });
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    expect(wrapper.get("h2").text()).toBe("Judul");
    expect(wrapper.text()).toContain("isi");
    const dlg = wrapper.get("dialog");
    expect(dlg.attributes("aria-labelledby")).toBe(wrapper.get("h2").attributes("id"));
  });

  it("mengirim event close saat dialog ditutup atau dibatalkan", async () => {
    const { wrapper } = await renderWithProviders(ModalBase, { props: { title: "J" } });
    await wrapper.get("dialog").trigger("close");
    await wrapper.get("dialog").trigger("cancel");
    expect(wrapper.emitted("close")).toHaveLength(2);
  });
});
