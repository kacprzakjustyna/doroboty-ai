/* The match score orders reading; it does not predict who will do the job well.
   Design system rule: one ink fact in IBM Plex Mono, no band, bar or color, and
   the method-limit note is required wherever a score is visible. */
export function MatchScore({ score }: { score: number }) {
  return (
    <span className="match-score">
      <span className="sr-only">Ocena dopasowania tekstu: </span>
      {score}
      <small>/100</small>
    </span>
  );
}

export function ScoreLimitNote() {
  return (
    <p className="score-limit">
      Ocena porównuje tekst aplikacji z opisem stanowiska. Pomaga ustalić kolejność przeglądania —
      nie przewiduje, kto sprawdzi się w pracy.
    </p>
  );
}
