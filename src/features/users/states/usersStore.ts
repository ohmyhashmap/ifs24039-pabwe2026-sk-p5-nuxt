import { defineStore } from "pinia";
import { ref } from "vue";
import * as api from "../api/userApi";

export const useUsersStore = defineStore("users", () => {
  const users = ref([]);
  const user = ref(null);
  const profile = ref(null);
  const isLoading = ref(false);

  async function asyncGetUsers() {
    isLoading.value = true;
    const res = await api.getUsers();
    if (res.ok) users.value = res.data.users || [];
    isLoading.value = false;
    return res;
  }
  async function asyncGetProfile() {
    const res = await api.getMe();
    if (res.ok) profile.value = res.data.user;
    return res;
  }
  async function asyncUpdateProfile(payload) {
    const res = await api.putMe(payload);
    if (res.ok) await asyncGetProfile();
    return res;
  }
  async function asyncChangePhoto(file) {
    const res = await api.postPhoto(file);
    if (res.ok) await asyncGetProfile();
    return res;
  }
  const asyncChangePassword = (payload) => api.putPassword(payload);

  return { users, user, profile, isLoading, asyncGetUsers, asyncGetProfile, asyncUpdateProfile, asyncChangePhoto, asyncChangePassword };
});
