import { MessageType } from "~/services/toast-service";
import { showToast } from "./trigger-toast";

export function handleError(error: any) {
  if (!!error && !!error?.response) {
    showToast({
      type: MessageType.Danger,
      text: error?.response?.data?.detail,
    });
    return;
  }

  showToast({
    type: MessageType.Danger,
    text: "Ocorreu um erro no servidor. Por favor, tente novamente em instantes.",
  });
}
