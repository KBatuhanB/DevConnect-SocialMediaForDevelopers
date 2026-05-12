import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";

export default function Loading() {
  return (
    <main className="page-shell loading-shell">
      <Card className="dashboard-card">
        <Skeleton className="skeleton-title" />
        <Skeleton className="skeleton-line" />
        <Skeleton className="skeleton-line" />
      </Card>
    </main>
  );
}