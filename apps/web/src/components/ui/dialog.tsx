"use client";

import { useEffect, useRef } from "react";
import { Button } from "./button";

type DialogProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function Dialog({ open, title, description, onClose, children }: DialogProps) {
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
    <dialog className="ui-dialog" onClose={onClose} ref={dialogRef}>
      <div className="ui-dialog-card">
        <div className="ui-dialog-header">
          <div>
            <h2>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>

          <Button onClick={onClose} type="button" variant="ghost">
            Kapat
          </Button>
        </div>

        <div className="ui-dialog-body">{children}</div>
      </div>
    </dialog>
  );
}