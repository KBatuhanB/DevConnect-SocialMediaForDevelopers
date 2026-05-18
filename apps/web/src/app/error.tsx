"use client";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="status-page-shell">
      <Card accent className="status-card">
        <p className="eyebrow">Global hata siniri</p>
        <h1>Arayuz bu istegi simdilik tamamlayamadi</h1>
        <p>Akista kalmak icin yeniden deneyebilir veya bir onceki ekrana donerek devam edebilirsin.</p>
        <div className="status-card-actions">
          <Button onClick={() => reset()} type="button">
            Tekrar dene
          </Button>
        </div>
      </Card>
    </main>
  );
}