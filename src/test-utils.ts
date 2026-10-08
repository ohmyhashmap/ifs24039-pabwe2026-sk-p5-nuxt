import { h } from "vue";
import type { Component } from "vue";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

/** Pinia baru untuk pengujian; state awal opsional (hidrasi setup store). */
export function createMockPinia(initialState: Record<string, any> = {}) {
  const pinia = createPinia();
  pinia.state.value = initialState;
  setActivePinia(pinia);
  return pinia;
}

export const Stub: Component = { render: () => h("div", "stub") };

interface RenderOptions {
  props?: Record<string, any>;
  slots?: Record<string, any>;
  route?: string;
  routes?: RouteRecordRaw[];
  pinia?: ReturnType<typeof createPinia>;
}

/** Render komponen dengan Pinia dan Memory History Vue Router. */
export async function renderWithProviders(component: Component, options: RenderOptions = {}) {
  const pinia = options.pinia ?? createMockPinia();
  const router = createRouter({
    history: createMemoryHistory(),
    routes: options.routes ?? [{ path: "/:pathMatch(.*)*", component: Stub }],
  });
  router.push(options.route ?? "/");
  await router.isReady();
  const wrapper = mount(component as any, {
    props: options.props,
    slots: options.slots,
    global: { plugins: [pinia, router] },
  });
  await flushPromises();
  return { wrapper, router, pinia };
}

export const ok = (data: any = {}, message = "Berhasil") => ({ ok: true, message, data });
export const fail = (message = "Gagal", unauthorized = false) => ({ ok: false, message, data: {}, unauthorized });
export { flushPromises };
