const swal = async (opts: Record<string, any>) => {
  const { default: Swal } = await import("sweetalert2");
  return Swal.fire({
    color: "#0f172a",
    background: "#ffffff",
    confirmButtonColor: "#4338ca",
    cancelButtonColor: "#475569",
    showClass: { popup: "", backdrop: "", icon: "" },
    hideClass: { popup: "", backdrop: "", icon: "" },
    ...opts,
  });
};

export const showSuccessDialog = (text: string) => swal({ icon: "success", title: "Berhasil", text });
export const showErrorDialog = (text: string) => swal({ icon: "error", title: "Gagal", text });
export const showConfirmDialog = async (text: string, confirmText: string = "Ya, lanjutkan") => {
  const r = await swal({
    icon: "warning",
    title: "Apakah kamu yakin?",
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Batal",
    confirmButtonColor: "#b91c1c",
  });
  return r.isConfirmed;
};

export const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n || 0);

export const parseDate = (s: string) => new Date(String(s).replace(" ", "T"));
export const formatDate = (s?: string) =>
  s ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(parseDate(s)) : "-";

export const toApiDate = (v: string, end = false) => (v ? `${v} ${end ? "23:59:59" : "00:00:00"}` : "");

/** Alamat foto yang aman dimuat: URL https, atau path relatif dari server API. Selain itu null (pakai inisial). */
export const photoSrc = (p?: string | null): string | null => {
  if (!p) return null;
  if (p.startsWith("https://")) return p;
  if (p.startsWith("http")) return null;
  return `${new URL(DELCOM_BASEURL).origin}/${p.replace(/^\//, "")}`;
};
export const initialOf = (name?: string) => (name || "?").trim().charAt(0).toUpperCase() || "?";
