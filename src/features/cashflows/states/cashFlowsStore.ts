import { defineStore } from "pinia";
import { ref } from "vue";
import * as api from "../api/cashFlowApi";
import type { CashFlowPayload, CashFlowQueryParams } from "../api/cashFlowApi";
import type { ApiResult } from "../../../helpers/apiHelper";

export type { CashFlowQueryParams };
export interface CashFlow {
  id: number; user_id: number; type: "inflow" | "outflow"; source: "cash" | "savings" | "loans";
  label: string; description: string; nominal: number; created_at: string; updated_at: string;
}
export type CashFlowStats = Record<string, number>;
export interface CashFlowsState {
  cashFlows: CashFlow[]; cashFlow: CashFlow | null; stats: CashFlowStats; labels: string[];
}

export const useCashFlowsStore = defineStore("cashFlows", () => {
  const cashFlows = ref<CashFlow[]>([]);
  const cashFlow = ref<CashFlow | null>(null);
  const stats = ref<CashFlowStats>({});
  const labels = ref<string[]>([]);
  const statsDaily = ref<Record<string, Record<string, number>>>({});
  const statsMonthly = ref<Record<string, Record<string, number>>>({});
  const isCashFlow = ref(false);
  const isCashFlowAdd = ref(false);
  const isCashFlowAdded = ref(false);
  const isCashFlowChange = ref(false);
  const isCashFlowChanged = ref(false);
  const isCashFlowDelete = ref(false);
  const isCashFlowDeleted = ref(false);
  const isCashFlowDeleteAll = ref(false);
  const isCashFlowDeletedAll = ref(false);

  async function run(loading: { value: boolean }, done: { value: boolean }, fn: () => Promise<ApiResult>) {
    loading.value = true;
    done.value = false;
    const res = await fn();
    done.value = res.ok;
    loading.value = false;
    return res;
  }

  async function asyncGetCashFlows(params?: CashFlowQueryParams) {
    isCashFlow.value = true;
    const res = await api.getCashFlows(params);
    if (res.ok) { cashFlows.value = res.data.cash_flows || []; stats.value = res.data.stats || {}; }
    isCashFlow.value = false;
    return res;
  }
  async function asyncGetCashFlow(id: string | number) {
    isCashFlow.value = true;
    cashFlow.value = null;
    const res = await api.getCashFlow(id);
    if (res.ok) cashFlow.value = res.data.cash_flow;
    isCashFlow.value = false;
    return res;
  }
  async function asyncGetLabels() {
    const res = await api.getLabels();
    if (res.ok) labels.value = res.data.labels || [];
    return res;
  }
  async function asyncGetStatsDaily() {
    const res = await api.getStatsDaily();
    if (res.ok) statsDaily.value = res.data;
    return res;
  }
  async function asyncGetStatsMonthly() {
    const res = await api.getStatsMonthly();
    if (res.ok) statsMonthly.value = res.data;
    return res;
  }
  const asyncAddCashFlow = (p: CashFlowPayload) => run(isCashFlowAdd, isCashFlowAdded, () => api.postCashFlow(p));
  const asyncChangeCashFlow = (id: number, p: CashFlowPayload) => run(isCashFlowChange, isCashFlowChanged, () => api.putCashFlow(id, p));
  const asyncDeleteCashFlow = (id: number) => run(isCashFlowDelete, isCashFlowDeleted, () => api.deleteCashFlow(id));
  const asyncDeleteAllCashFlows = () => run(isCashFlowDeleteAll, isCashFlowDeletedAll, () => api.deleteAllCashFlows());

  return {
    cashFlows, cashFlow, stats, labels, statsDaily, statsMonthly, isCashFlow, isCashFlowAdd, isCashFlowAdded,
    isCashFlowChange, isCashFlowChanged, isCashFlowDelete, isCashFlowDeleted, isCashFlowDeleteAll, isCashFlowDeletedAll,
    asyncGetCashFlows, asyncGetCashFlow, asyncGetLabels, asyncGetStatsDaily, asyncGetStatsMonthly,
    asyncAddCashFlow, asyncChangeCashFlow, asyncDeleteCashFlow, asyncDeleteAllCashFlows,
  };
});
