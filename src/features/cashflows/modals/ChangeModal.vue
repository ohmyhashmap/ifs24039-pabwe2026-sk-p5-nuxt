<script setup lang="ts">
import ModalBase from "../components/ModalBase.vue";
import CashFlowForm from "../components/CashFlowForm.vue";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import type { CashFlow } from "../states/cashFlowsStore";
import type { CashFlowPayload } from "../api/cashFlowApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

const props = defineProps<{ cashFlow: CashFlow }>();
const emit = defineEmits(["close", "saved"]);
const store = useCashFlowsStore();

async function save(payload: CashFlowPayload) {
  const res = await store.asyncChangeCashFlow(props.cashFlow.id, payload);
  if (res.ok) { emit("saved"); emit("close"); showSuccessDialog(res.message); }
  else showErrorDialog(res.message);
}
</script>
<template>
  <ModalBase title="Ubah Transaksi" @close="$emit('close')">
    <CashFlowForm prefix="chg" :initial="cashFlow" :labels="store.labels" :busy="store.isCashFlowChange" submit-text="Simpan perubahan" @submit="save" @cancel="$emit('close')" />
  </ModalBase>
</template>
