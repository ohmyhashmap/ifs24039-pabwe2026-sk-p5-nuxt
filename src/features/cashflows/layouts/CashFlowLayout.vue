<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterView, useRouter } from "vue-router";
import NavbarComponent from "../components/NavbarComponent.vue";
import SidebarComponent from "../components/SidebarComponent.vue";
import { useAuthStore } from "../../auth/states/authStore";
import { useUsersStore } from "../../users/states/usersStore";

const auth = useAuthStore();
const users = useUsersStore();
const router = useRouter();
const open = ref(false);

async function logout() {
  await auth.asyncLogout();
  router.replace("/auth/login");
}
onMounted(async () => {
  const res = await users.asyncGetProfile();
  if (res.unauthorized) await logout();
});
</script>
<template>
  <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3 focus:font-bold">Lewati ke konten utama</a>
  <NavbarComponent :name="users.profile?.name || 'Pengguna'" :username="users.profile?.email || ''" :open="open" @toggle="open = !open" @logout="logout" />
  <div class="lg:flex">
    <SidebarComponent :open="open" @navigate="open = false" />
    <main id="main" class="min-w-0 flex-1 p-4 sm:p-6"><RouterView /></main>
  </div>
</template>
