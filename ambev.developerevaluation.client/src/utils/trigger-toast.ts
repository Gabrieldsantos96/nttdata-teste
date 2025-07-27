import {
  type EventManagerDataTransfer,
  toastEventManager,
} from "~/services/toast-service";

export function showToast({ type, text, duration }: EventManagerDataTransfer) {
  toastEventManager.emit("addToast", { type, text, duration });
}
