"use client";

import { useEffect, useRef } from "react";
import { cn } from "../../lib/cn";
import { Button } from "./button";

type DialogProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  cardClassName?: string;
  bodyClassName?: string;
};

export function Dialog({ open, title, description, onClose, children, className, cardClassName, bodyClassName }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog className={cn("ui-dialog", className)} onClose={onClose} ref={dialogRef}>
      <div className={cn("ui-dialog-card", cardClassName)}>
        <div className="ui-dialog-header">
          <div>
            <h2>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>

          <Button onClick={onClose} type="button" variant="ghost">
            Kapat
          </Button>
        </div>

        <div className={cn("ui-dialog-body", bodyClassName)}>{children}</div>
      </div>
    </dialog>
  );
}