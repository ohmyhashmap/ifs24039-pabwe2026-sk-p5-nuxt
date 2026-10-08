export const SOURCES = [
  { value: "cash", label: "Tunai" },
  { value: "savings", label: "Tabungan" },
  { value: "loans", label: "Pinjaman" },
] as const;
export const TYPES = [
  { value: "inflow", label: "Pemasukan (Inflow)" },
  { value: "outflow", label: "Pengeluaran (Outflow)" },
] as const;
export const sourceLabel = (v: string) => SOURCES.find((s) => s.value === v)?.label ?? v;
export const typeLabel = (v: string) => (v === "inflow" ? "Pemasukan" : "Pengeluaran");
