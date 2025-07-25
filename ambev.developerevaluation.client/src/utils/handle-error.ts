import { MessageType } from "@/services/toast-service";
import { showToast } from "./trigger-toast";

export function handleError(error: any) {
  if (
    !!error?.errors &&
    Array.isArray(error?.errors) &&
    !!error.errors[0].extensions.message
  ) {
    showToast({
      type: MessageType.Danger,
      text: error.errors[0].extensions.message,
    });
    return;
  }

  if (!!error && !!error?.message) {
    showToast({
      type: MessageType.Danger,
      text: error.message,
    });
    return;
  }

  showToast({
    type: MessageType.Danger,
    text: "Error",
  });
}
