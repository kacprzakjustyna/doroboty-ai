import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import posthog from "posthog-js";
import { initialState, transition, type Action, type Person, type State } from "./model";
import { STORAGE_KEY, parseState, readState, saveState, type StoragePort } from "./storage";
function browserStorage(): StoragePort | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
function useStore() {
  const [loaded] = useState(() => readState(browserStorage()));
  const [state, setState] = useState(loaded.state);
  const [issue, setIssue] = useState(loaded.issue);
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(loaded.blocked);
  const latest = useRef(state);
  const identifiedPersonId = useRef<string | null>(null);
  const posthogEnabled = Boolean(
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  );
  const identifyPerson = useCallback(
    (person: Person) => {
      if (!posthogEnabled) return;

      posthog.identify(person.id, { name: person.name, role: person.role });
      identifiedPersonId.current = person.id;
    },
    [posthogEnabled],
  );
  function commit(next: State, replace = false) {
    latest.current = next;
    setState(next);
    setError("");
    if (blocked && !replace) return;
    try {
      saveState(browserStorage(), next);
      setIssue("");
      if (replace) setBlocked(false);
    } catch (e) {
      setIssue((e as Error).message);
    }
  }
  function run(action: Action) {
    try {
      const previousPersonId = latest.current.activePersonId;
      const next = transition(latest.current, action);

      if (action.type === "select_person" && action.id !== previousPersonId) {
        if (previousPersonId !== null && posthogEnabled) posthog.reset();
        identifiedPersonId.current = null;
        const person = next.people.find((item) => item.id === action.id);
        if (person) identifyPerson(person);
      }

      commit(next);
      return true;
    } catch (e) {
      setError(
        e instanceof Error && e.name !== "ZodError"
          ? e.message
          : "Sprawdź poprawność i długość wprowadzonych danych.",
      );
      return false;
    }
  }
  function importState(raw: string) {
    try {
      const next = parseState(raw);
      commit(next, true);
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    }
  }
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);
  useEffect(() => {
    const person = state.people.find((item) => item.id === state.activePersonId);
    if (!person) {
      if (identifiedPersonId.current !== null && posthogEnabled) posthog.reset();
      identifiedPersonId.current = null;
      return;
    }
    if (identifiedPersonId.current === person.id) return;

    if (identifiedPersonId.current !== null && posthogEnabled) posthog.reset();
    identifyPerson(person);
  }, [identifyPerson, posthogEnabled, state.activePersonId, state.people]);
  useEffect(() => {
    // Another tab saved the scenario: adopt its newer valid state so this tab's
    // next save does not silently overwrite those changes.
    function onStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY || event.newValue === null) return;
      let next: State;
      try {
        next = parseState(event.newValue);
      } catch {
        return;
      }
      latest.current = next;
      setState(next);
      setBlocked(false);
      setIssue("Dane zmieniły się w innej karcie. Ta karta pokazuje teraz najnowszą wersję.");
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return {
    state,
    issue,
    error,
    blocked,
    original: loaded.original,
    run,
    importState,
    clearError: () => setError(""),
    reset: () => {
      if (latest.current.activePersonId !== null && posthogEnabled) posthog.reset();
      identifiedPersonId.current = null;
      commit(initialState(), true);
    },
  };
}
type Store = ReturnType<typeof useStore>;
const Context = createContext<Store | null>(null);
export function PrototypeProvider({ children }: { children: ReactNode }) {
  const store = useStore();
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function usePrototype() {
  const store = useContext(Context);
  if (!store) throw new Error("PrototypeProvider is required");
  return store;
}
