"use client";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="page-shell error-shell">
      <Card accent className="error-card">
        <p className="eyebrow">Global hata siniri</p>
        <h1>Arayuz bu istegi simdilik tamamlayamadi</h1>
        <p>
          Teknik ayrintiyi kullaniciya acmadan sade bir hata ekrani gosteriyoruz. Tekrar denemek
          icin asagidaki butonu kullanabilirsin.
        </p>
        <Button onClick={() => reset()} type="button">
          Tekrar dene
        </Button>
      </Card>
    </main>
  );
}