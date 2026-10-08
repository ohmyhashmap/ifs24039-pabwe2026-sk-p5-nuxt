<script setup lang="ts">
import { onMounted, ref, useId } from "vue";

defineProps({ title: { type: String, required: true } });
const emit = defineEmits(["close"]);
const dlg = ref(null);
const titleId = useId();
onMounted(() => dlg.value.showModal());
</script>
<template>
  <dialog ref="dlg" :aria-labelledby="titleId" class="m-auto w-[min(32rem,calc(100%-2rem))] rounded-2xl p-0 text-slate-900 shadow-2xl backdrop:bg-slate-900/60" @close="emit('close')" @cancel.prevent="emit('close')">
    <div class="p-6">
      <h2 :id="titleId" class="text-xl font-extrabold">{{ title }}</h2>
      <div class="mt-4"><slot /></div>
    </div>
  </dialog>
</template>
