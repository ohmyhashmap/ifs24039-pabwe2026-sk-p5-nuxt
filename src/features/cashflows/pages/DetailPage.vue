<script setup lang="ts">
import { onMounted, ref, defineAsyncComponent } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import { sourceLabel, typeLabel } from "../constants";
import { formatDate, formatRupiah, showConfirmDialog, showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

const ChangeModal = defineAsyncComponent(() => import("../modals/ChangeModal.vue"));
const store = useCashFlowsStore();
const route = useRoute();
const router = useRouter();
const id = route.params.cashFlowId as string;
const editing = ref(false);

const load = () => store.asyncGetCashFlow(id);
onMounted(() => { load(); store.asyncGetLabels(); });

async function remove() {
  if (!(await showConfirmDialog("Transaksi ini akan dihapus.", "Ya, hapus"))) return;
  const res = await store.asyncDeleteCashFlow(Number(id));
  if (res.ok) { await showSuccessDialog(res.message); router.replace("/"); } else showErrorDialog(res.message);
}
</script>
<template>
  <p v-if="store.isCashFlow" role="status">Memuat transaksi...</p>
  <section v-else-if="!store.cashFlow">
    <RouterLink to="/" class="font-bold text-indigo-800 underline">Kembali ke ringkasan</RouterLink>
    <h1 class="mt-3 text-2xl font-extrabold">Transaksi tidak ditemukan</h1>
    <p role="alert" class="mt-2 text-red-800">Data transaksi tidak tersedia.</p>
  </section>
  <article v-else>
    <RouterLink to="/" class="font-bold text-indigo-800 underline">Kembali ke ringkasan</RouterLink>
    <h1 class="mt-3 text-2xl font-extrabold">Detail Transaksi: {{ store.cashFlow.label }}</h1>
    <dl class="card mt-4 grid gap-4 p-5 sm:grid-cols-2">
      <div><dt class="text-sm font-semibold text-slate-700">Jenis</dt><dd class="font-bold">{{ typeLabel(store.cashFlow.type) }}</dd></div>
      <div><dt class="text-sm font-semibold text-slate-700">Sumber dana</dt><dd class="font-bold">{{ sourceLabel(store.cashFlow.source) }}</dd></div>
      <div><dt class="text-sm font-semibold text-slate-700">Nominal</dt><dd class="text-xl font-extrabold">{{ formatRupiah(store.cashFlow.nominal) }}</dd></div>
      <div><dt class="text-sm font-semibold text-slate-700">Label</dt><dd class="font-bold">{{ store.cashFlow.label }}</dd></div>
      <div class="sm:col-span-2"><dt class="text-sm font-semibold text-slate-700">Deskripsi</dt><dd>{{ store.cashFlow.description }}</dd></div>
      <div><dt class="text-sm font-semibold text-slate-700">Dibuat</dt><dd>{{ formatDate(store.cashFlow.created_at) }}</dd></div>
      <div><dt class="text-sm font-semibold text-slate-700">Diperbarui</dt><dd>{{ formatDate(store.cashFlow.updated_at) }}</dd></div>
    </dl>
    <div class="mt-4 flex gap-2">
      <button type="button" class="btn btn-primary" @click="editing = true">Ubah</button>
      <button type="button" class="btn btn-danger" @click="remove">Hapus</button>
    </div>
    <ChangeModal v-if="editing" :cash-flow="store.cashFlow" @close="editing = false" @saved="load" />
  </article>
</template>
