import { describe, it, expect, vi } from "vitest";
import * as api from "./cashFlowApi";
import { apiFetch } from "../../../helpers/apiHelper";

vi.mock("../../../helpers/apiHelper", () => ({ apiFetch: vi.fn().mockResolvedValue({ ok: true }) }));
const body = { type: "inflow", source: "cash", label: "gaji", description: "d", nominal: 1 } as any;

describe("cashFlowApi", () => {
  it("memanggil seluruh endpoint cash flow", async () => {
    await api.getCashFlows({ type: "inflow" });
    await api.getCashFlow(1);
    await api.postCashFlow(body);
    await api.putCashFlow(2, body);
    await api.deleteCashFlow(3);
    await api.getLabels();
    await api.getStatsDaily({ total_data: 7 });
    await api.getStatsMonthly();
    await api.deleteAllCashFlows();
    const calls = vi.mocked(apiFetch).mock.calls;
    expect(calls[0]).toEqual(["/cash-flows", { params: { type: "inflow" } }]);
    expect(calls[1]).toEqual(["/cash-flows/1"]);
    expect(calls[2]).toEqual(["/cash-flows", { method: "POST", body }]);
    expect(calls[3]).toEqual(["/cash-flows/2", { method: "PUT", body }]);
    expect(calls[4]).toEqual(["/cash-flows/3", { method: "DELETE" }]);
    expect(calls[5]).toEqual(["/cash-flows/labels"]);
    expect(calls[6]).toEqual(["/cash-flows/stats/daily", { params: { total_data: 7 } }]);
    expect(calls[7]).toEqual(["/cash-flows/stats/monthly", { params: undefined }]);
    expect(calls[8]).toEqual(["/cash-flows", { method: "DELETE" }]);
  });
});
