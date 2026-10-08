import { describe, it, expect, vi } from "vitest";

vi.mock("../router", () => ({ setupGuards: vi.fn() }));

describe("guards.client", () => {
  it("memasang guard pada router Nuxt", async () => {
    (globalThis as any).defineNuxtPlugin = (fn: any) => fn;
    const { default: plugin } = await import("./guards.client");
    const { setupGuards } = await import("../router");
    const router = {};
    (plugin as any)({ $router: router });
    expect(setupGuards).toHaveBeenCalledWith(router);
  });
});
