import { describe, it, expect } from "vitest";
import routerOptions from "./router.options";
import routes from "./routes";

describe("router.options", () => {
  it("menyediakan rute dari routes.ts", () => {
    expect((routerOptions.routes as any)()).toBe(routes);
  });
});
