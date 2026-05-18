import { Card } from "./card";

export function NotFoundPanel() {
  return (
    <div className="status-page-shell">
      <Card accent className="status-card status-card-not-found">
        <div aria-hidden="true" className="status-ghost-number">404</div>

        <div className="status-card-inner">
          <div aria-hidden="true" className="status-code-pill">404</div>
          <h1 className="status-card-heading">Bu ekran DevConnect haritasında yer almıyor</h1>
          <p className="status-card-desc">Üsteki navigasyon çubuğuyla başka bir alana geçebilirsin.</p>
        </div>
      </Card>
    </div>
  );
}