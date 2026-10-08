import type { RouterConfig } from "@nuxt/schema";
import AuthLayout from "./features/auth/layouts/AuthLayout.vue";
import LoginPage from "./features/auth/pages/LoginPage.vue";
import RegisterPage from "./features/auth/pages/RegisterPage.vue";

type Routes = Exclude<RouterConfig["routes"], undefined | ((...a: any[]) => any)>;

const routes: Routes = [
  {
    path: "/auth",
    component: AuthLayout,
    meta: { guest: true },
    children: [
      { path: "login", component: LoginPage, meta: { title: "Masuk" } },
      { path: "register", component: RegisterPage, meta: { title: "Daftar" } },
    ],
  },
  {
    path: "/",
    component: () => import("./features/cashflows/layouts/CashFlowLayout.vue"),
    meta: { auth: true },
    children: [
      { path: "", component: () => import("./features/cashflows/pages/HomePage.vue"), meta: { title: "Ringkasan Arus Kas" } },
      { path: "cash-flows/:cashFlowId", component: () => import("./features/cashflows/pages/DetailPage.vue"), meta: { title: "Detail Transaksi" } },
      { path: "users", component: () => import("./features/users/pages/UsersPage.vue"), meta: { title: "Daftar Pengguna" } },
      { path: "profile", component: () => import("./features/users/pages/ProfilePage.vue"), meta: { title: "Profil Saya" } },
    ],
  },
  { path: "/:pathMatch(.*)*", component: () => import("./features/common/pages/NotFoundPage.vue"), meta: { title: "Halaman Tidak Ditemukan" } },
];

export default routes;
