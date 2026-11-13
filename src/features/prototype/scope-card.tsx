import { scopeCardFields, type Application } from "./model";

type ScopeCard = NonNullable<Application["scopeCard"]>;

/** Counts filled fields only. It is a prototype signal about completeness, never a candidate score. */
export function scopeCardSignal(card: ScopeCard) {
  const missing = scopeCardFields.filter(([key]) => !card[key].trim()).map(([, label]) => label);
  const filled = scopeCardFields.length - missing.length;
  return {
    filled,
    missing,
    text:
      `Wypełnione pola: ${filled}/${scopeCardFields.length}` +
      (missing.length ? ` · brak: ${missing.join(", ")}` : ""),
  };
}

export function ScopeCardSignal({ card }: { card: ScopeCard }) {
  return <p className="data scope-card-signal">Karta zakresu · {scopeCardSignal(card).text}</p>;
}

export function ScopeCardView({ card }: { card: ScopeCard }) {
  return (
    <section className="scope-card" aria-labelledby="scope-card-heading">
      <div className="scope-card-head">
        <p className="eyebrow">Karta zakresu · słowa kandydata</p>
        <h3 id="scope-card-heading">Co kandydat zrobił sam</h3>
      </div>
      <dl className="scope-card-fields">
        {scopeCardFields.map(([key, label]) => (
          <div key={key} className="scope-card-field">
            <dt className="eyebrow">{label}</dt>
            <dd>
              {card[key].trim() ? (
                card[key]
              ) : (
                <span className="scope-card-empty">Kandydat tego nie podał.</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
      <p className="data scope-card-signal">{scopeCardSignal(card).text}</p>
      <p className="record-caption scope-card-note">
        Prototyp, symulacja: kartę złożono ze słów kandydata z aplikacji i wywiadu badawczego, bez
        dopisywania treści. Licznik pokazuje tylko wypełnione pola — nie ocenia kandydata.
      </p>
    </section>
  );
}
