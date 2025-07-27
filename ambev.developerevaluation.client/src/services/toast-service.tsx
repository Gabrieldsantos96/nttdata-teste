import { EventManager } from "~/lib/event-manager";
import { cn } from "~/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export enum MessageType {
  Default = "default",
  Success = "success",
  Danger = "danger",
  Warning = "warning",
}

export type EventManagerDataTransfer = Omit<MessageComponentProps, "id">;

export const toastEventManager = new EventManager<EventManagerDataTransfer>();

type MessageComponentProps = {
  id: number;
  text?: string;
  type?: MessageType;
  duration?: number;
};

type ToastMessageComponentProps = {
  message: MessageComponentProps;
  onRemoveMessage: (id: number) => void;
};

function ToastMessageComponent({
  onRemoveMessage,
  message,
}: ToastMessageComponentProps) {
  const getIcon = () => {
    switch (message.type) {
      case MessageType.Danger:
        return <AlertCircle className="h-5 w-5" />;
      case MessageType.Success:
        return <CheckCircle className="h-5 w-5" />;
      case MessageType.Warning:
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <MessageCircle className="h-5 w-5" />;
    }
  };

  const getVariantClasses = () => {
    switch (message.type) {
      case MessageType.Danger:
        return "bg-destructive text-white border-destructive/20";
      case MessageType.Success:
        return "bg-green-500 text-white border-green-200 dark:bg-green-950 dark:text-green-100 dark:border-green-800";
      case MessageType.Warning:
        return "bg-yellow-50 text-white border-yellow-200 dark:bg-yellow-950 dark:text-yellow-100 dark:border-yellow-800";
      default:
        return "bg-background text-foreground border-border";
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onRemoveMessage(message.id);
    }, message.duration || 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [message, onRemoveMessage]);

  const handleRemoveToast = () => {
    onRemoveMessage(message.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn(
        "flex items-center w-full max-w-sm p-4 mb-4 rounded-lg border shadow-lg cursor-pointer",
        getVariantClasses()
      )}
      onClick={handleRemoveToast}
    >
      <div className="flex items-center gap-3 flex-1">
        {getIcon()}
        <span className="font-medium text-sm">{message.text}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveToast();
        }}
        className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

type ToastListProps = {
  messages: MessageComponentProps[];
  handleRemoveMessage: (id: number) => void;
};

function ToastList({ messages, handleRemoveMessage }: ToastListProps) {
  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col-reverse">
      <AnimatePresence>
        {messages.map((message) => (
          <ToastMessageComponent
            key={message.id}
            message={message}
            onRemoveMessage={handleRemoveMessage}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export function ToastService() {
  const [messages, setMessages] = useState<MessageComponentProps[]>([]);

  function handleAddToast({ type, text, duration }: EventManagerDataTransfer) {
    setMessages((prevState: MessageComponentProps[]) => [
      ...prevState,
      {
        id: Math.random(),
        type: type ?? MessageType.Default,
        text,
        duration: duration ?? 3000,
      },
    ]);
  }

  useEffect(() => {
    toastEventManager.on("addToast", handleAddToast);
    return () => {
      toastEventManager.removeListener("addToast", handleAddToast);
    };
  }, []);

  const handleRemoveMessage = useCallback((id: number) => {
    setMessages((prevState) =>
      prevState.filter((message) => message.id !== id)
    );
  }, []);

  return (
    <ToastList messages={messages} handleRemoveMessage={handleRemoveMessage} />
  );
}
