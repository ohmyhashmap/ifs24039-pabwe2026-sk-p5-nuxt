import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { postLogin, postRegister, postLogout } from "../api/authApi";
import { getAccessToken, putAccessToken } from "../../../helpers/apiHelper";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(getAccessToken());
  const isLoading = ref(false);
  const isAuthLogin = computed(() => !!token.value);
  const isAuthRegister = ref(false);
  const isAuthLogout = ref(false);

  async function asyncLogin(payload) {
    isLoading.value = true;
    const res = await postLogin(payload);
    isLoading.value = false;
    if (res.ok) {
      token.value = res.data.token;
      putAccessToken(res.data.token);
      isAuthLogout.value = false;
    }
    return res;
  }
  async function asyncRegister(payload) {
    isLoading.value = true;
    const res = await postRegister(payload);
    isLoading.value = false;
    isAuthRegister.value = res.ok;
    return res;
  }
  async function asyncLogout() {
    await postLogout();
    token.value = null;
    putAccessToken(null);
    isAuthLogout.value = true;
  }
  return { token, isLoading, isAuthLogin, isAuthRegister, isAuthLogout, asyncLogin, asyncRegister, asyncLogout };
});
