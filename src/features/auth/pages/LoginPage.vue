<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Mail, Lock, LogIn } from "lucide-vue-next";
import { useAuthStore } from "../states/authStore";
import { useInput } from "../../../hooks/useInput";
import { showErrorDialog } from "../../../helpers/toolsHelper";

const auth = useAuthStore();
const router = useRouter();
const [email, onEmail] = useInput();
const [password, onPassword] = useInput();
const error = ref("");

async function submit() {
  error.value = "";
  if (!email.value || !password.value) { error.value = "Email dan kata sandi wajib diisi."; return; }
  const res = await auth.asyncLogin({ email: email.value, password: password.value });
  if (res.ok) router.replace("/");
  else showErrorDialog(res.message);
}
</script>
<template>
  <h1 class="sr-only">Masuk Akun</h1>
  <form class="space-y-4" novalidate @submit.prevent="submit">
    <div>
      <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700" for="login-email-input">Alamat email</label>
      <div class="relative">
        <Mail class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-600" aria-hidden="true" />
        <input id="login-email-input" type="email" autocomplete="email" class="field pl-10" :value="email" @input="onEmail" placeholder="nama@email.com" required />
      </div>
    </div>
    <div>
      <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700" for="login-password-input">Kata sandi</label>
      <div class="relative">
        <Lock class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-600" aria-hidden="true" />
        <input id="login-password-input" type="password" autocomplete="current-password" class="field pl-10" :value="password" @input="onPassword" placeholder="••••••••" required />
      </div>
    </div>
    <p v-if="error" role="alert" class="text-sm font-semibold text-red-700">{{ error }}</p>
    <button id="login-submit-button" class="btn btn-primary w-full shadow-lg shadow-indigo-500/30" type="submit" :disabled="auth.isLoading">
      <LogIn class="size-4" aria-hidden="true" /> {{ auth.isLoading ? "Memproses..." : "Masuk Sekarang" }}
    </button>
  </form>
</template>
