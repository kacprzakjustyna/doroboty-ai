import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { usePrototype } from "./store";
import { serializeState } from "./storage";
import { downloadText } from "./settings";
import { REPORT_PROBLEM_URL } from "./support";

function RenderFailure({ onRecover }: { onRecover: () => void }) {
  const { state } = usePrototype();
  return (
    <main className="prototype-section max-w-3xl" tabIndex={-1}>
      <h1>Coś poszło nie tak</h1>
      <div className="prototype-panel prototype-form mt-6">
        <p>
          Ten ekran nie mógł się wyświetlić. Twoje dane scenariusza nadal są zapisane w tej
          przeglądarce. Dla pewności możesz pobrać ich kopię.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => downloadText("doroboty-scenariusz.json", serializeState(state))}
          >
            Pobierz kopię danych
          </Button>
          <Button
            onClick={() => {
              window.location.hash = "#/oferty";
              onRecover();
            }}
          >
            Wróć do ofert
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Odśwież stronę
          </Button>
        </div>
        <p>
          Jeśli problem się powtarza,{" "}
          <a className="underline" href={REPORT_PROBLEM_URL} target="_blank" rel="noreferrer">
            zgłoś go na GitHubie
          </a>{" "}
          i opisz, co klikałaś lub klikałeś tuż przed błędem.
        </p>
      </div>
    </main>
  );
}

// Catches render failures in routed screens so users see recovery steps instead of
// a blank page. Error details are intentionally not logged: they can contain free text.
export class RenderErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return <RenderFailure onRecover={() => this.setState({ failed: false })} />;
    return this.props.children;
  }
}
