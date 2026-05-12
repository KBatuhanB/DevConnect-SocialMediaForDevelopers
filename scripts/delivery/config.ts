export const deliveryCheckConfig = {
  items: [
    {
      path: "README.md",
      kind: "file",
      reason: "Kok kurulum ve komut rehberi"
    },
    {
      path: "plan.md",
      kind: "file",
      reason: "Ana plan ve faz referansi"
    },
    {
      path: "Muhteris_SRS.pdf",
      kind: "file",
      reason: "Orijinal gereksinim raporu"
    },
    {
      path: "Muhteris_SDD.pdf",
      kind: "file",
      reason: "Orijinal tasarim raporu"
    },
    {
      path: "Muhteris_SPMP.pdf",
      kind: "file",
      reason: "Orijinal planlama raporu"
    },
    {
      path: "render.yaml",
      kind: "file",
      reason: "API deploy blueprint'i"
    },
    {
      path: "apps/api/.env.production.example",
      kind: "file",
      reason: "API production env referansi"
    },
    {
      path: "apps/web/.env.production.example",
      kind: "file",
      reason: "Web production env referansi"
    },
    {
      path: "docs/phase-13/README.md",
      kind: "file",
      reason: "Operasyon hazirligi ozeti"
    },
    {
      path: "docs/phase-13/release-notes-v0.1.0.md",
      kind: "file",
      reason: "Release notu"
    },
    {
      path: "docs/phase-14/README.md",
      kind: "file",
      reason: "Faz 14 ozeti"
    },
    {
      path: "docs/phase-14/report-alignment.md",
      kind: "file",
      reason: "Rapor uyum notlari"
    },
    {
      path: "docs/phase-14/setup-env-api-and-schema.md",
      kind: "file",
      reason: "Kurulum ve API ozeti"
    },
    {
      path: "docs/phase-14/presentation-and-demo-plan.md",
      kind: "file",
      reason: "Demo ve sunum akisi"
    },
    {
      path: "docs/phase-14/test-summary-limitations-and-defense.md",
      kind: "file",
      reason: "Test ve savunma notlari"
    },
    {
      path: "docs/phase-14/delivery-certification.md",
      kind: "file",
      reason: "Teslim checklist'i"
    }
  ]
} as const;

export type DeliveryCheckItem = (typeof deliveryCheckConfig.items)[number];