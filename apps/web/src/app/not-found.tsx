import { NotFoundPanel } from "../components/ui/not-found-panel";
import { AppFrame } from "../features/app-shell/components/app-frame";
import { hasServerSession } from "../features/auth/server";

export default function NotFound() {
  if (hasServerSession()) {
    return (
      <AppFrame layout="topbar">
        <NotFoundPanel />
      </AppFrame>
    );
  }

  return (
    <main>
      <NotFoundPanel />
    </main>
  );
}