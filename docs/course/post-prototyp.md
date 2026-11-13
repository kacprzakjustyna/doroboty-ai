# Prototyp: karta zakresu dla rekrutera w DoRoboty.ai

**Screenshot do questa:** `1-karta-natalii.png`

**Screenshoty do posta (w tej kolejności):** `2-lista-kandydatow.png`, `1-karta-natalii.png`,
`3-kuba-vs-natalia.png`

---

## Treść posta

**Prototyp: karta „Co kandydat zrobił sam” w panelu rekrutera DoRoboty.ai**

Kontekst: cel biznesowy to ponowny zakup — firmy, które kupiły ogłoszenie, mają wracać po kolejne w ciągu 90 dni. Od czerwca 2026 wraca 30% zamiast wcześniejszych 45%. Firmy zaczynają szkic kolejnego ogłoszenia, ale rzadziej za nie płacą.

**Jaki problem użytkownika rozwiązuję**

Użytkownikiem jest rekruter. Z aplikacji nie wie, co kandydat zrobił sam, a co zrobił jego zespół. Asystent pisania wygładza odpowiedzi, więc brzmią podobnie, a Match Score też jest podobny. Rekruter zaprasza ludzi „do sprawdzenia” i dopiero na rozmowie widzi różnicę.

Przykład z danych: Kuba i Natalia aplikowali na to samo stanowisko inżynierskie, mieli 82 i 83 punkty, a po asystencie ich odpowiedzi brzmiały prawie tak samo. Na rozmowie okazało się, że Kuba zbudował indeksowanie i ewaluację (przeszedł dalej), a Natalia robiła demo i prezentację (odrzucona — inny zakres).

Prototyp dodaje na górze aplikacji kartę o stałej strukturze: **Moja część / Co robił zespół / Efekt / Jak to sprawdzono** — w słowach kandydata. Pole, którego kandydat nie wypełnił, pokazuje „Kandydat tego nie podał”, zamiast je dopowiadać.

**Po czym poznam, że prototyp działa**

Zadanie: rekruterka BrightLabs otwiera listę kandydatów na stanowisko AI Engineer i decyduje, kogo zaprosić na rozmowę.

Oczekiwany wynik: patrząc tylko na karty, widzi różnicę, której nie było w tekście po asystencie — Kuba zrobił dokładnie to, czego wymaga ogłoszenie (własny komponent i ewaluacja), Natalia zrobiła demo i prezentację, a pipeline zbudowała inna osoba. Rozmowę z Natalią „do sprawdzenia” da się zastąpić przeczytaniem karty. U Oli karta przywraca to, co asystent usunął: efekt („skrócił się czas przygotowania odpowiedzi”) i dowód (notatka przed i po).

Na tych trzech przypadkach karta pokazuje różnicę. Jedno ograniczenie wyszło od razu: licznik wypełnionych pól daje Kubie i Natalii po 3/4, więc kandydatów odróżnia treść karty, a nie liczba.

Czego prototyp nie sprawdza: czy mniej rozmów „do sprawdzenia” sprawi, że firma zapłaci za kolejne ogłoszenie. To hipoteza — sprawdziłby ją dopiero test A/B na firmach w prawdziwym portalu (3–4 miesiące).

**Co działa naprawdę, a co jest symulacją**

Działa naprawdę:

- klikalna aplikacja (React): lista kandydatów i widok aplikacji rekrutera, na komputerze i telefonie;
- karta i licznik wyświetlają się z danych aplikacji; licznik liczy wypełnione pola na żywo;
- rekruter może dalej zmieniać etap i pisać notatki, a dane zapisują się w przeglądarce.

Przygotowana symulacja:

- treść kart złożyłam ręcznie ze słów kandydatów z aplikacji i wywiadów badawczych — nie ma asystenta, który dopytuje kandydata, ani żadnego modelu AI;
- kandydaci, odpowiedzi i Match Score pochodzą z fikcyjnych danych kursowych;
- karty są „lepsze” niż w rzeczywistości, bo wywiad był dłuższy niż krótka rozmowa z asystentem;
- licznik pokazuje tylko liczbę wypełnionych pól — nie ocenia kandydata;
- nie ma backendu ani pomiaru wpływu na płatność.

Następny krok: ekran kandydata — asystent, który dopytuje o konkret i pozwala zatwierdzić kartę przed wysłaniem.
