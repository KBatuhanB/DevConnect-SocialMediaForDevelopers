import { Button } from "./button";
import { Card } from "./card";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Card className="empty-state">
      <p className="eyebrow">Bos durum</p>
      <h2>{title}</h2>
      <p>{description}</p>

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