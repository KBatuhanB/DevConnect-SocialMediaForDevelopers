"use client";

import { Button } from "@web/components/ui/button";
import { Card } from "@web/components/ui/card";

export default function ProtectedError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="status-page-shell">
      <Card accent className="status-card">
        <p className="eyebrow">Bir seyler ters gitti</p>
        <h1>Bu sayfa su anda acilamiyor</h1>
        <p>Akista kalmak icin yeniden dene veya ustteki gezinme ile baska bir sayfaya gec.</p>
        <div className="status-card-actions">
          <Button onClick={() => reset()} type="button">
            Tekrar dene
          </Button>
        </div>
      </Card>
    </div>
  );
}