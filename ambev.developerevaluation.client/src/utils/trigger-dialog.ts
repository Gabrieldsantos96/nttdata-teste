import type React from "react";
import {
  dialogEventManager,
  type IDialogEventProps,
} from "~/services/dialog-service";

export function openDialog<T = unknown>(
  component: React.ComponentType<any>,
  props?: {
    componentProps?: Record<string, unknown>;
    dialogProps?: IDialogEventProps["dialogProps"];
    contentProps?: IDialogEventProps["contentProps"];
    className?: string;
  }
): Promise<T> {
  return new Promise((resolve) => {
    const id = crypto.randomUUID();

    const dialogProps: IDialogEventProps = {
      id,
      component,
      componentProps: props?.componentProps,
      dialogProps: props?.dialogProps,
      contentProps: props?.contentProps,
      className: props?.className,
      resolver: resolve as (data: unknown) => void,
    };

    dialogEventManager.emit("dialog", dialogProps);
  });
}
