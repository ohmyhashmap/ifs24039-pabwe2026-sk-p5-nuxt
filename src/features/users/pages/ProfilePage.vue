<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useUsersStore } from "../states/usersStore";
import { initialOf, photoSrc, showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

const store = useUsersStore();
const name = ref("");
const email = ref("");
const emptyPw = () => ({ password: "", new_password: "", new_password_confirmation: "" });
const pw = ref(emptyPw());

const photoUrl = computed(() => photoSrc(store.profile?.photo));

watch(() => store.profile, (p) => { if (p) { name.value = p.name; email.value = p.email; } }, { immediate: true });
onMounted(store.asyncGetProfile);

const done = (res) => (res.ok ? showSuccessDialog(res.message) : showErrorDialog(res.message));
const saveProfile = async () => done(await store.asyncUpdateProfile({ name: name.value, email: email.value }));
const savePhoto = async (e: Event) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) done(await store.asyncChangePhoto(f)); };
async function savePassword() {
  const res = await store.asyncChangePassword({ ...pw.value });
  if (res.ok) pw.value = emptyPw();
  done(res);
}
</script>
<template>
  <h1 class="text-2xl font-extrabold">Profil Saya</h1>
  <div v-if="store.profile" class="mt-4 grid gap-6 lg:grid-cols-2">
    <section class="card p-5" aria-labelledby="h-data">
      <h2 id="h-data" class="text-lg font-bold">Data akun</h2>
      <img v-if="photoUrl" :src="photoUrl" :alt="`Foto profil ${store.profile.name}`" width="96" height="96" class="my-4 size-24 rounded-full bg-slate-200 object-cover" />
      <span v-else class="my-4 grid size-24 place-items-center rounded-full bg-indigo-100 text-4xl font-extrabold text-indigo-800" aria-hidden="true">{{ initialOf(store.profile.name) }}</span>
      <label class="label" for="photo">Ganti foto profil</label>
      <input id="photo" type="file" accept="image/*" class="field mb-4" @change="savePhoto" />
      <form class="space-y-4" @submit.prevent="saveProfile">
        <div><label class="label" for="pname">Nama</label><input id="pname" v-model="name" class="field" required /></div>
        <div><label class="label" for="pemail">Email</label><input id="pemail" v-model="email" type="email" class="field" required /></div>
        <button class="btn btn-primary" type="submit">Simpan profil</button>
      </form>
    </section>
    <section class="card p-5" aria-labelledby="h-pw">
      <h2 id="h-pw" class="text-lg font-bold">Ubah kata sandi</h2>
      <form class="mt-4 space-y-4" @submit.prevent="savePassword">
        <div><label class="label" for="pw1">Kata sandi saat ini</label><input id="pw1" v-model="pw.password" type="password" autocomplete="current-password" class="field" required /></div>
        <div><label class="label" for="pw2">Kata sandi baru</label><input id="pw2" v-model="pw.new_password" type="password" autocomplete="new-password" class="field" required /></div>
        <div><label class="label" for="pw3">Konfirmasi kata sandi baru</label><input id="pw3" v-model="pw.new_password_confirmation" type="password" autocomplete="new-password" class="field" required /></div>
        <button class="btn btn-primary" type="submit">Ubah kata sandi</button>
      </form>
    </section>
  </div>
  <p v-else class="mt-4" role="status">Memuat profil...</p>
</template>
