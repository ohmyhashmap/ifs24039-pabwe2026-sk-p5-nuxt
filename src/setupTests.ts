import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

// jsdom belum mengimplementasikan <dialog>.showModal()/close().
HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
  this.setAttribute("open", "");
});
HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
  this.removeAttribute("open");
});

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
