import { describe, it, expect } from "vitest";
import routes from "./routes";

const flatten = (list: any[]): any[] => list.flatMap((r) => [r, ...flatten(r.children ?? [])]);

describe("routes", () => {
  const all = flatten(routes as any[]);

  it("mendefinisikan rute sesuai modul", () => {
    const paths = all.map((r) => r.path);
    expect(paths).toEqual(expect.arrayContaining(["/auth", "login", "register", "/", "", "cash-flows/:cashFlowId", "users", "profile", "/:pathMatch(.*)*"]));
  });

  it("menandai rute auth dan guest", () => {
    expect(routes.find((r) => r.path === "/auth")?.meta?.guest).toBe(true);
    expect(routes.find((r) => r.path === "/")?.meta?.auth).toBe(true);
  });

  it("seluruh komponen rute dapat dimuat", async () => {
    for (const r of all) {
      if (!r.component) continue;
      const loaded = typeof r.component === "function" ? await r.component() : { default: r.component };
      expect(loaded.default).toBeTruthy();
    }
  });
});
