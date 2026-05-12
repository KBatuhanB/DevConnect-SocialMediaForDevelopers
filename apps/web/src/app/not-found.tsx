import Link from "next/link";
import { EmptyState } from "../components/ui/empty-state";
import { authFeatureConfig } from "../features/auth/config";

export default function NotFound() {
  return (
    <main className="page-shell">
      <EmptyState
        description="Rota bulundu ama bir sayfa eslesmedi. Ana giris alanina donerek devam edebilirsin."
        title="Sayfa bulunamadi"
      />

      <div className="not-found-link-row">
        <Link className="ui-link" href={authFeatureConfig.paths.home}>
          Ana akisa don
        </Link>
      </div>
    </main>
  );
}