<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { User, Mail, Lock, UserPlus } from "lucide-vue-next";
import { useAuthStore } from "../states/authStore";
import { useInput } from "../../../hooks/useInput";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

const auth = useAuthStore();
const router = useRouter();
const [name, onName] = useInput();
const [email, onEmail] = useInput();
const [password, onPassword] = useInput();
const error = ref("");

async function submit() {
  error.value = "";
  if (!name.value || !email.value || password.value.length < 6) { error.value = "Lengkapi semua data. Kata sandi minimal 6 karakter."; return; }
  const res = await auth.asyncRegister({ name: name.value, email: email.value, password: password.value });
  if (res.ok) { await showSuccessDialog(res.message); router.replace("/auth/login"); }
  else showErrorDialog(res.message);
}
</script>
<template>
  <h1 class="sr-only">Daftar Akun</h1>
  <form class="space-y-4" novalidate @submit.prevent="submit">
    <div>
      <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700" for="register-name-input">Nama lengkap</label>
      <div class="relative">
        <User class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-600" aria-hidden="true" />
        <input id="register-name-input" type="text" autocomplete="name" class="field pl-10" :value="name" @input="onName" placeholder="Nama lengkap" required />
      </div>
    </div>
    <div>
      <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700" for="register-email-input">Alamat email</label>
      <div class="relative">
        <Mail class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-600" aria-hidden="true" />
        <input id="register-email-input" type="email" autocomplete="email" class="field pl-10" :value="email" @input="onEmail" placeholder="nama@email.com" required />
      </div>
    </div>
    <div>
      <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700" for="register-password-input">Kata sandi</label>
      <div class="relative">
        <Lock class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-600" aria-hidden="true" />
        <input id="register-password-input" type="password" autocomplete="new-password" class="field pl-10" :value="password" @input="onPassword" placeholder="Minimal 6 karakter" required />
      </div>
    </div>
    <p v-if="error" role="alert" class="text-sm font-semibold text-red-700">{{ error }}</p>
    <button id="register-submit-button" class="btn btn-primary w-full shadow-lg shadow-indigo-500/30" type="submit" :disabled="auth.isLoading">
      <UserPlus class="size-4" aria-hidden="true" /> {{ auth.isLoading ? "Memproses..." : "Daftar Sekarang" }}
    </button>
  </form>
</template>
