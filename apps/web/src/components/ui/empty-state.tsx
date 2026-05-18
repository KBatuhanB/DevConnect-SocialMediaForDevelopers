import { cn } from "../../lib/cn";
import { Button } from "./button";
import { Card } from "./card";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  eyebrow?: string | null;
  showOrbit?: boolean;
};

export function EmptyState({ title, description, actionLabel, onAction, eyebrow = "Bos durum", showOrbit = true }: EmptyStateProps) {
  return (
    <Card className={cn("empty-state", !showOrbit && !eyebrow && !actionLabel && "empty-state-minimal")}>
      {showOrbit ? (
        <div aria-hidden="true" className="empty-state-orbit">
          <span className="empty-state-orbit-core" />
          <span className="empty-state-orbit-ring" />
        </div>
      ) : null}

      <div className="empty-state-copy">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      {actionLabel && onAction ? (
        <div className="empty-state-action">
          <Button onClick={onAction} type="button">
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </Card>
  );
}