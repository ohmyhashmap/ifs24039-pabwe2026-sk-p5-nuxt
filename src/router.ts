import type { Router } from "vue-router";
import { getAccessToken } from "./helpers/apiHelper";

/** Pasang guard autentikasi dan judul halaman pada router. */
export function setupGuards(router: Router) {
  router.beforeEach((to) => {
    const logged = !!getAccessToken();
    if (to.matched.some((r) => r.meta.auth) && !logged) return "/auth/login";
    if (to.matched.some((r) => r.meta.guest) && logged) return "/";
  });
  router.afterEach((to) => {
    document.title = `${(to.meta.title as string) || "Delcom Cash Flow"} - Delcom Cash Flow`;
  });
}
