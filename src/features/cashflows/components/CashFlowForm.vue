<script setup lang="ts">
import { ref } from "vue";
import { SOURCES, TYPES } from "../constants";
import type { CashFlowPayload } from "../api/cashFlowApi";

const props = defineProps<{ initial?: Partial<CashFlowPayload>; labels: string[]; busy: boolean; submitText: string; prefix: string }>();
const emit = defineEmits<{ (e: "submit", v: CashFlowPayload): void; (e: "cancel"): void }>();

const f = ref({
  type: props.initial?.type ?? "inflow",
  source: props.initial?.source ?? "cash",
  label: props.initial?.label ?? "",
  nominal: props.initial?.nominal ? String(props.initial.nominal) : "",
  description: props.initial?.description ?? "",
});
const submit = () => emit("submit", { ...f.value, nominal: Number(f.value.nominal) } as CashFlowPayload);
</script>
<template>
  <form class="space-y-4" @submit.prevent="submit">
    <div>
      <label class="label" :for="`${prefix}-type`">Jenis arus kas</label>
      <select :id="`${prefix}-type`" v-model="f.type" class="field"><option v-for="t in TYPES" :key="t.value" :value="t.value">{{ t.label }}</option></select>
    </div>
    <div>
      <label class="label" :for="`${prefix}-source`">Sumber dana</label>
      <select :id="`${prefix}-source`" v-model="f.source" class="field"><option v-for="s in SOURCES" :key="s.value" :value="s.value">{{ s.label }}</option></select>
    </div>
    <div>
      <label class="label" :for="`${prefix}-label`">Label kategori</label>
      <input :id="`${prefix}-label`" v-model="f.label" class="field" :list="`${prefix}-labels`" required />
      <datalist :id="`${prefix}-labels`"><option v-for="l in labels" :key="l" :value="l" /></datalist>
    </div>
    <div>
      <label class="label" :for="`${prefix}-nominal`">Nominal (Rp)</label>
      <input :id="`${prefix}-nominal`" v-model="f.nominal" type="number" min="1" class="field" required />
    </div>
    <div>
      <label class="label" :for="`${prefix}-desc`">Keterangan</label>
      <textarea :id="`${prefix}-desc`" v-model="f.description" rows="3" class="field" required></textarea>
    </div>
    <div class="flex justify-end gap-2">
      <button type="button" class="btn btn-light" @click="emit('cancel')">Batal</button>
      <button type="submit" class="btn btn-primary" :disabled="busy">{{ submitText }}</button>
    </div>
  </form>
</template>
