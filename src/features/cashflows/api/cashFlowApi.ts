import { apiFetch } from "../../../helpers/apiHelper";

export interface CashFlowPayload {
  type: "inflow" | "outflow";
  source: "cash" | "savings" | "loans";
  label: string;
  description: string;
  nominal: number;
}
export interface CashFlowQueryParams {
  type?: string; source?: string; label?: string; start_date?: string; end_date?: string;
}

export const getCashFlows = (params?: CashFlowQueryParams) => apiFetch("/cash-flows", { params });
export const getCashFlow = (id: string | number) => apiFetch(`/cash-flows/${id}`);
export const postCashFlow = (body: CashFlowPayload) => apiFetch("/cash-flows", { method: "POST", body });
export const putCashFlow = (id: string | number, body: CashFlowPayload) => apiFetch(`/cash-flows/${id}`, { method: "PUT", body });
export const deleteCashFlow = (id: string | number) => apiFetch(`/cash-flows/${id}`, { method: "DELETE" });
export const getLabels = () => apiFetch("/cash-flows/labels");
export const getStatsDaily = (params?: { end_date?: string; total_data?: number }) => apiFetch("/cash-flows/stats/daily", { params });
export const getStatsMonthly = (params?: { end_date?: string; total_data?: number }) => apiFetch("/cash-flows/stats/monthly", { params });
export const deleteAllCashFlows = () => apiFetch("/cash-flows", { method: "DELETE" });
