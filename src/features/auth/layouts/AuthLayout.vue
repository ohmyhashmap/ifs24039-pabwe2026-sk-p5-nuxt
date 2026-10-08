<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from "vue-router";
import { Wallet } from "lucide-vue-next";

const route = useRoute();
const tabs = [
  { to: "/auth/login", label: "Masuk Akun" },
  { to: "/auth/register", label: "Daftar Baru" },
];
</script>
<template>
  <main id="main" class="grid min-h-screen place-items-center bg-linear-to-br from-slate-100 via-white to-indigo-50 p-4">
    <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 sm:p-8">
      <div class="flex flex-col items-center text-center">
        <div class="grid size-14 place-items-center rounded-2xl bg-linear-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30">
          <Wallet class="size-7" aria-hidden="true" />
        </div>
        <p class="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">Delcom Cash Flow</p>
        <p class="mt-1 text-sm text-slate-600">Aplikasi Pencatat Arus Kas &amp; Keuangan Pribadi</p>
      </div>

      <div class="mt-6 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200 sm:p-6">
        <nav aria-label="Pilih halaman akun" class="grid grid-cols-2 gap-1 rounded-2xl bg-slate-200 p-1">
          <RouterLink
            v-for="t in tabs"
            :key="t.to"
            :to="t.to"
            :aria-current="route.path === t.to ? 'page' : undefined"
            class="rounded-xl px-3 py-2 text-center text-sm font-bold transition"
            :class="route.path === t.to ? 'bg-white text-indigo-700 shadow' : 'text-slate-700 hover:bg-slate-100'"
          >{{ t.label }}</RouterLink>
        </nav>
        <div class="mt-5"><RouterView /></div>
      </div>
    </div>
  </main>
</template>
