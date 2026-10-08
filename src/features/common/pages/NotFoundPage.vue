<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
<template>
  <main id="main" class="grid min-h-screen place-items-center p-6 text-center">
    <div>
      <p class="text-6xl font-extrabold text-indigo-700">404</p>
      <h1 class="mt-2 text-2xl font-extrabold">Halaman tidak ditemukan</h1>
      <p class="mt-2 text-slate-700">Alamat yang kamu tuju tidak tersedia.</p>
      <RouterLink to="/" class="btn btn-primary mt-6">Kembali ke beranda</RouterLink>
    </div>
  </main>
</template>
