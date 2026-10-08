import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCashFlowsStore } from "./cashFlowsStore";
import * as api from "../api/cashFlowApi";
import { createMockPinia, ok, fail } from "../../../test-utils";

vi.mock("../api/cashFlowApi");
const payload = { type: "inflow", source: "cash", label: "g", description: "d", nominal: 1 } as any;

describe("cashFlowsStore", () => {
  beforeEach(() => createMockPinia());

  it("asyncGetCashFlows berhasil, data kosong, dan gagal", async () => {
    const s = useCashFlowsStore();
    vi.mocked(api.getCashFlows).mockResolvedValueOnce(ok({ cash_flows: [{ id: 1 }], stats: { cashflow: 5 } }) as any);
    await s.asyncGetCashFlows({ type: "inflow" });
    expect(s.cashFlows).toHaveLength(1);
    expect(s.stats.cashflow).toBe(5);
    expect(s.isCashFlow).toBe(false);
    vi.mocked(api.getCashFlows).mockResolvedValueOnce(ok({}) as any);
    await s.asyncGetCashFlows();
    expect(s.cashFlows).toEqual([]);
    expect(s.stats).toEqual({});
    vi.mocked(api.getCashFlows).mockResolvedValueOnce(fail() as any);
    await s.asyncGetCashFlows();
    expect(s.cashFlows).toEqual([]);
  });

  it("asyncGetCashFlow", async () => {
    const s = useCashFlowsStore();
    vi.mocked(api.getCashFlow).mockResolvedValueOnce(ok({ cash_flow: { id: 9 } }) as any);
    await s.asyncGetCashFlow(9);
    expect(s.cashFlow).toEqual({ id: 9 });
    vi.mocked(api.getCashFlow).mockResolvedValueOnce(fail() as any);
    await s.asyncGetCashFlow(10);
    expect(s.cashFlow).toBeNull();
  });

  it("asyncGetLabels", async () => {
    const s = useCashFlowsStore();
    vi.mocked(api.getLabels).mockResolvedValueOnce(ok({ labels: ["a"] }) as any);
    await s.asyncGetLabels();
    expect(s.labels).toEqual(["a"]);
    vi.mocked(api.getLabels).mockResolvedValueOnce(ok({}) as any);
    await s.asyncGetLabels();
    expect(s.labels).toEqual([]);
    vi.mocked(api.getLabels).mockResolvedValueOnce(fail() as any);
    await s.asyncGetLabels();
    expect(s.labels).toEqual([]);
  });

  it("statistik harian dan bulanan", async () => {
    const s = useCashFlowsStore();
    vi.mocked(api.getStatsDaily).mockResolvedValueOnce(ok({ stats_inflow: { d: 1 } }) as any);
    await s.asyncGetStatsDaily();
    expect(s.statsDaily).toEqual({ stats_inflow: { d: 1 } });
    vi.mocked(api.getStatsDaily).mockResolvedValueOnce(fail() as any);
    await s.asyncGetStatsDaily();
    expect(s.statsDaily).toEqual({ stats_inflow: { d: 1 } });
    vi.mocked(api.getStatsMonthly).mockResolvedValueOnce(ok({ stats_inflow: { m: 1 } }) as any);
    await s.asyncGetStatsMonthly();
    expect(s.statsMonthly).toEqual({ stats_inflow: { m: 1 } });
    vi.mocked(api.getStatsMonthly).mockResolvedValueOnce(fail() as any);
    await s.asyncGetStatsMonthly();
    expect(s.statsMonthly).toEqual({ stats_inflow: { m: 1 } });
  });

  it("aksi mutasi mengatur status loading dan selesai", async () => {
    const s = useCashFlowsStore();
    vi.mocked(api.postCashFlow).mockResolvedValueOnce(ok() as any);
    await s.asyncAddCashFlow(payload);
    expect(s.isCashFlowAdded).toBe(true);
    expect(s.isCashFlowAdd).toBe(false);
    vi.mocked(api.postCashFlow).mockResolvedValueOnce(fail() as any);
    await s.asyncAddCashFlow(payload);
    expect(s.isCashFlowAdded).toBe(false);

    vi.mocked(api.putCashFlow).mockResolvedValueOnce(ok() as any);
    await s.asyncChangeCashFlow(1, payload);
    expect(s.isCashFlowChanged).toBe(true);

    vi.mocked(api.deleteCashFlow).mockResolvedValueOnce(ok() as any);
    await s.asyncDeleteCashFlow(1);
    expect(s.isCashFlowDeleted).toBe(true);

    vi.mocked(api.deleteAllCashFlows).mockResolvedValueOnce(ok() as any);
    await s.asyncDeleteAllCashFlows();
    expect(s.isCashFlowDeletedAll).toBe(true);
  });
});
