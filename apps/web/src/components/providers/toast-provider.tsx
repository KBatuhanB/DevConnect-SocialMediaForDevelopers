"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { designSystemConfig } from "../../features/design-system/config";
import { cn } from "../../lib/cn";

type ToastTone = "info" | "success" | "error";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastInput = Omit<ToastItem, "id">;

type ToastContextValue = {
  pushToast: (toast: ToastInput) => void;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function buildToastClassName(tone: ToastTone) {
  return cn(
    "toast-item",
    tone === "success" && "toast-success",
    tone === "error" && "toast-error",
    tone === "info" && "toast-info"
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: ToastInput) => {
      const id = crypto.randomUUID();

      setItems((current) => [...current, { ...toast, id }]);

      window.setTimeout(() => {
        dismissToast(id);
      }, designSystemConfig.feedback.toastDurationMs);
    },
    [dismissToast]
  );

  const value = useMemo(
    () => ({
      pushToast,
      dismissToast
    }),
    [dismissToast, pushToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {items.map((item) => (
          <div className={buildToastClassName(item.tone)} key={item.id}>
            <div>
              <strong>{item.title}</strong>
              {item.description ? <p>{item.description}</p> : null}
            </div>

            <button className="toast-close" onClick={() => dismissToast(item.id)} type="button">
              Kapat
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast sadece ToastProvider altinda kullanilabilir.");
  }

  return context;
}