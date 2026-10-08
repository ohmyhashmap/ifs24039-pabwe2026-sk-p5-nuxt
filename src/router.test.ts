import { describe, it, expect, beforeEach } from "vitest";
import { createMemoryHistory, createRouter } from "vue-router";
import { setupGuards } from "./router";
import { putAccessToken } from "./helpers/apiHelper";
import { Stub } from "./test-utils";

function makeRouter() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: Stub, meta: { auth: true, title: "Beranda" } },
      { path: "/auth/login", component: Stub, meta: { guest: true } },
      { path: "/umum", component: Stub },
    ],
  });
  setupGuards(router);
  return router;
}

describe("setupGuards", () => {
  beforeEach(() => localStorage.clear());

  it("mengarahkan tamu dari halaman terproteksi ke login", async () => {
    const router = makeRouter();
    await router.push("/");
    expect(router.currentRoute.value.path).toBe("/auth/login");
  });

  it("mengizinkan pengguna login ke halaman terproteksi dan mengatur judul", async () => {
    putAccessToken("t");
    const router = makeRouter();
    await router.push("/");
    expect(router.currentRoute.value.path).toBe("/");
    expect(document.title).toBe("Beranda - Delcom Cash Flow");
  });

  it("mengarahkan pengguna login dari halaman tamu ke beranda", async () => {
    putAccessToken("t");
    const router = makeRouter();
    await router.push("/auth/login");
    expect(router.currentRoute.value.path).toBe("/");
  });

  it("membiarkan halaman tanpa guard dan memakai judul bawaan", async () => {
    const router = makeRouter();
    await router.push("/umum");
    expect(router.currentRoute.value.path).toBe("/umum");
    expect(document.title).toBe("Delcom Cash Flow - Delcom Cash Flow");
  });
});
