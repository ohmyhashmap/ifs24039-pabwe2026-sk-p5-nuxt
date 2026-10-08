import { setupGuards } from "../router";

export default defineNuxtPlugin((nuxtApp) => {
  setupGuards(nuxtApp.$router as any);
});
