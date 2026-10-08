<script setup lang="ts">
import { onMounted } from "vue";
import { useUsersStore } from "../states/usersStore";
import { initialOf, photoSrc } from "../../../helpers/toolsHelper";

const store = useUsersStore();
onMounted(store.asyncGetUsers);
</script>
<template>
  <h1 class="text-2xl font-extrabold">Daftar Pengguna</h1>
  <p v-if="store.isLoading" class="mt-4" role="status">Memuat pengguna...</p>
  <ul v-else class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <li v-for="u in store.users" :key="u.id" class="card flex items-center gap-4 p-4">
      <img v-if="photoSrc(u.photo)" :src="photoSrc(u.photo)" :alt="`Foto ${u.name}`" width="56" height="56" loading="lazy" class="size-14 rounded-full bg-slate-200 object-cover" />
      <span v-else class="grid size-14 shrink-0 place-items-center rounded-full bg-indigo-100 text-xl font-extrabold text-indigo-800" aria-hidden="true">{{ initialOf(u.name) }}</span>
      <div class="min-w-0">
        <p class="truncate font-bold">{{ u.name }}</p>
        <p class="truncate text-sm text-slate-700">{{ u.email }}</p>
      </div>
    </li>
  </ul>
</template>
