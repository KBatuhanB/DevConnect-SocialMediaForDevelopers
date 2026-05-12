import { buildHealthUrl } from "../api";
import { appShellConfig } from "../config";
import type { AppShellHomeProps } from "../types";
import { hasVisibleSteps } from "../validation";

export function AppShellHome({ apiBaseUrl, nextSteps }: AppShellHomeProps) {
  const healthUrl = buildHealthUrl();
  const canShowSteps = hasVisibleSteps(nextSteps);

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="muted">Faz 2 repo iskeleti hazir</p>
        <h1>{appShellConfig.app.name}</h1>
        <p>{appShellConfig.app.description}</p>

        <div className="hero-grid">
          <div className="info-card">
            <strong>API tabani</strong>
            <p className="muted">{apiBaseUrl}</p>
          </div>
          <div className="info-card">
            <strong>Health ucu</strong>
            <p className="muted">{healthUrl}</p>
          </div>
        </div>
      </section>

      {canShowSteps ? (
        <section className="info-grid" aria-label="Sonraki adimlar">
          {nextSteps.map((step) => (
            <article className="info-card" key={step}>
              <strong>Sonraki adim</strong>
              <p className="muted">{step}</p>
            </article>
          ))}
        </section>
      ) : null}
    </main>
  );
}