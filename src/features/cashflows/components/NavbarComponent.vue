<script setup lang="ts">
import { Menu, LogOut, Wallet } from "lucide-vue-next";
import { initialOf } from "../../../helpers/toolsHelper";

defineProps({ name: { type: String, default: "Pengguna" }, username: { type: String, default: "" }, open: Boolean });
defineEmits(["toggle", "logout"]);
</script>
<template>
  <header class="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur">
    <div class="flex items-center gap-3">
      <button type="button" class="btn btn-light lg:hidden" aria-controls="sidebar" :aria-expanded="open" @click="$emit('toggle')">
        <Menu class="size-5" aria-hidden="true" /><span class="sr-only">Buka menu navigasi</span>
      </button>
      <span class="grid size-9 place-items-center rounded-xl bg-linear-to-br from-sky-500 to-indigo-600 text-white shadow shadow-indigo-500/30">
        <Wallet class="size-5" aria-hidden="true" />
      </span>
      <p class="hidden font-extrabold text-slate-900 sm:block">Delcom Cash Flow</p>
    </div>
    <div class="flex items-center gap-3">
      <span class="grid size-9 place-items-center rounded-full bg-indigo-100 font-extrabold text-indigo-800" aria-hidden="true">{{ initialOf(name) }}</span>
      <div class="hidden text-right leading-tight sm:block">
        <p class="max-w-40 truncate text-sm font-bold">{{ name }}</p>
        <p v-if="username" class="max-w-40 truncate text-xs text-slate-700">{{ username }}</p>
      </div>
      <button type="button" class="btn btn-light" @click="$emit('logout')"><LogOut class="size-4" aria-hidden="true" /> Keluar</button>
    </div>
  </header>
</template>
