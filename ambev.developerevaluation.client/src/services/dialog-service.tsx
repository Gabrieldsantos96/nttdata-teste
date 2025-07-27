"use client";

import { EventManager } from "~/lib/event-manager";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { cn } from "~/lib/utils";

export type IDialogEventProps = {
  component: any;
  componentProps?: Record<string, unknown>;
  dialogProps?: React.ComponentProps<typeof Dialog>;
  contentProps?: React.ComponentProps<typeof DialogContent>;
  className?: string;
  resolver: (data: unknown) => void;
  id: string;
};

export type IDialogNestedProps<T> = {
  onResolve: (data: T) => void;
};

export const dialogEventManager = new EventManager<IDialogEventProps>();

export function DialogService() {
  const [dialogs, setDialogs] = useState<IDialogEventProps[]>([]);

  useEffect(() => {
    function onOpenDialog(dialog: IDialogEventProps | null) {
      if (dialog) {
        setDialogs((prev) => [...prev, dialog]);
      }
    }

    dialogEventManager.on("dialog", onOpenDialog);
    return () => dialogEventManager.removeListener("dialog", onOpenDialog);
  }, []);

  const closeDialog = (id: string, result: unknown) => {
    const dialog = dialogs.find((d) => d.id === id);
    dialog?.resolver(result);
    setDialogs((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <>
      {dialogs.map((dialog) => {
        const Component = dialog.component;
        return (
          <Dialog
            key={dialog.id}
            open={true}
            onOpenChange={(open) => {
              if (!open) {
                closeDialog(dialog.id, null);
              }
            }}
            {...dialog.dialogProps}
          >
            <DialogContent
              className={cn(
                "backdrop-blur-md bg-background/80 border-border/50",
                dialog.className
              )}
              {...dialog.contentProps}
            >
              <Component
                {...dialog.componentProps}
                onResolve={(result: unknown) => closeDialog(dialog.id, result)}
              />
            </DialogContent>
          </Dialog>
        );
      })}
    </>
  );
}
