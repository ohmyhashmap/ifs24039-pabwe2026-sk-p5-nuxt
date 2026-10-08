<script setup lang="ts">
import ModalBase from "../components/ModalBase.vue";
import CashFlowForm from "../components/CashFlowForm.vue";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import type { CashFlowPayload } from "../api/cashFlowApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

const emit = defineEmits(["close", "saved"]);
const store = useCashFlowsStore();

async function save(payload: CashFlowPayload) {
  const res = await store.asyncAddCashFlow(payload);
  if (res.ok) { emit("saved"); emit("close"); showSuccessDialog(res.message); }
  else showErrorDialog(res.message);
}
</script>
<template>
  <ModalBase title="Catat Transaksi Baru" @close="$emit('close')">
    <CashFlowForm prefix="add" :labels="store.labels" :busy="store.isCashFlowAdd" submit-text="Simpan" @submit="save" @cancel="$emit('close')" />
  </ModalBase>
</template>
