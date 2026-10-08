<script setup lang="ts">
import { RouterLink } from "vue-router";
import { LayoutDashboard, Users, UserRound } from "lucide-vue-next";

defineProps({ open: Boolean });
defineEmits(["navigate"]);
const links = [
  { to: "/", label: "Ringkasan Arus Kas", icon: LayoutDashboard },
  { to: "/users", label: "Direktori Pengguna", icon: Users },
  { to: "/profile", label: "Profil Saya", icon: UserRound },
];
</script>
<template>
  <nav id="sidebar" aria-label="Menu utama" :class="[open ? 'block' : 'hidden', 'border-b border-slate-200 bg-white p-4 lg:sticky lg:top-14 lg:block lg:h-[calc(100vh-3.5rem)] lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0']">
    <ul class="space-y-1">
      <li v-for="l in links" :key="l.to">
        <RouterLink :to="l.to" class="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 font-semibold text-slate-800 hover:bg-slate-100 aria-[current=page]:bg-indigo-50 aria-[current=page]:text-indigo-800" @click="$emit('navigate')">
          <component :is="l.icon" class="size-5" aria-hidden="true" /> {{ l.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
