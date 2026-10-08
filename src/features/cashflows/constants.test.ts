import { describe, it, expect } from "vitest";
import { SOURCES, TYPES, sourceLabel, typeLabel } from "./constants";

describe("constants", () => {
  it("memuat pilihan sumber dana dan jenis arus kas", () => {
    expect(SOURCES.map((s) => s.value)).toEqual(["cash", "savings", "loans"]);
    expect(TYPES.map((t) => t.value)).toEqual(["inflow", "outflow"]);
  });
  it("sourceLabel memakai label yang dikenal atau nilai aslinya", () => {
    expect(sourceLabel("savings")).toBe("Tabungan");
    expect(sourceLabel("lainnya")).toBe("lainnya");
  });
  it("typeLabel", () => {
    expect(typeLabel("inflow")).toBe("Pemasukan");
    expect(typeLabel("outflow")).toBe("Pengeluaran");
  });
});
