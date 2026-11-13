# North Star dla DoRoboty.ai

Krótka wersja do wklejenia w odpowiedź kursową. Pełna analiza, testy i ograniczenia:
[docs/tasks/north-star-metric.md](../tasks/north-star-metric.md).

---

## Gra: transakcje

DoRoboty.ai to dwustronny rynek — wartość powstaje w momencie dopasowania kandydata i firmy.

Nie uwaga: żadna ze stron nie chce spędzać tu więcej czasu. Rekruter ma 54 aplikacje na ogłoszenie
i medianę 2 dni na decyzję, więc dłuższy czas w produkcie znaczyłby, że się zaciął, a nie że mu
dobrze. Nie produktywność: przesiew jest zadaniem rekrutera, ale produkt sprzedaje dostęp do drugiej
strony rynku, a metryka produktywności mierzyłaby samego rekrutera i wyrzuciłaby kandydata z North
Stara. Liczoną transakcją jest dopasowanie, nie zakup ogłoszenia — firma płaci przed otrzymaniem
wartości, więc zakup jest wynikiem opóźnionym.

## North Star: „Trafne rozmowy"

Tygodniowa liczba pierwszych rozmów, po których pracodawca zdecydował się kontynuować z tym
kandydatem.

Jak liczę: jednostką jest para kandydat–ogłoszenie, liczona raz. Zaliczam ją, gdy odnotowano etap
„pierwsza rozmowa" i decyzję „kontynuacja" w ciągu 35 dni (mediana decyzji po rozmowie to 9 dni,
maksimum w danych 34). Przypisuję do tygodnia, w którym odbyła się rozmowa. Liczy się wyłącznie
decyzja po pierwszej rozmowie, maksymalnie jedna na parę, więc dodanie przez firmę kolejnych etapów
nie może podnieść metryki. Dziś to około 48 na tydzień (1 620 w 34 tygodniach) przy 146 pierwszych
rozmowach i 1 340 aplikacjach tygodniowo. Raportuję ją zawsze razem z liczbą na ogłoszenie (dziś
1,93), żeby odróżnić wzrost produktu od wzrostu rynku.

Dlaczego pokazuje wartość użytkownikom: kontynuacja to jedyne zdarzenie w danych, w którym obie
strony wygrywają jednocześnie — firma znalazła kogoś wartego dalszej rozmowy, a kandydat trafił na
proces odpowiadający temu, co faktycznie robił. Nie da się jej podnieść wygładzaniem tekstu, w
odróżnieniu od Match Score, który wzrósł z 68,4 na 78,5, podczas gdy zaproszenia i kontynuacje
spadły.

Dlaczego jest leading: jeśli trafne rozmowy rosną, spodziewamy się, że firma zapłaci za kolejne
ogłoszenie w ciągu 90 dni, ponieważ kolejne ogłoszenie kupuje się za to, co dało poprzednie.
Kontynuacja zapada w medianie 9 dni po rozmowie, a ponowny zakup mierzy się w oknie 90 dni, więc
metryka wyprzedza wynik biznesowy o 8–10 tygodni i leży w tym samym łańcuchu przyczynowym.
Przesłanka: w czerwcu 2026 kontynuacje spadły z 33,6% na 30,1%, a ponowny zakup z 45% na 30%,
podczas gdy Match Score rósł. To jedna obserwacja i jest obserwacyjna, więc traktuję to jako
przypuszczenie do sprawdzenia; główny test to porównanie firm z zerem trafnych rozmów z firmami,
które miały co najmniej jedną.

## Dźwignie

**1. Aplikacje z konkretem — ma rosnąć.** Udział aplikacji, w których kandydat wypełnił własnymi
słowami pola „Efekt" i „Jak to sprawdzono". Poprawa: ekran kandydata z asystentem, który dopytuje
dokładnie o te dwie rzeczy, i zatwierdzenie karty przed wysłaniem. Nie liczę wypełnionych pól 4/4,
bo Kuba i Natalia mają oba 3/4 — licznik już raz ich nie rozróżnił.

**2. Precyzja zaproszeń — ma rosnąć.** Udział pierwszych rozmów kończących się kontynuacją, dziś
32,7%. Poprawa: karta zakresu na górze aplikacji, przed wygładzoną odpowiedzią, sygnał karty na
liście kandydatów i porządkowanie listy treścią karty zamiast Match Score. North Star to rozmowy
pomnożone przez ten udział, więc wzrost z 32,7% na 38% daje 48 na 56 trafnych rozmów bez ani jednej
rozmowy więcej.

**3. Wstrzymane aplikacje — ma spadać.** Dziś 17,0% wszystkich przypisanych aplikacji, czyli około
228 tygodniowo. Poprawa: ta sama karta — to metryka główna zaprojektowanego testu A/B, z celem
14,4% — oraz przywracanie wstrzymanych na listę przed zamknięciem ogłoszenia.

**4. Aplikacje z jakąkolwiek decyzją — ma rosnąć.** Dziś 57%, czyli około 570 aplikacji tygodniowo
nie dostaje żadnej decyzji. Poprawa: krótszy przesiew jednej aplikacji dzięki karcie, lista
uporządkowana treścią i przypomnienie o nieprzejrzanych aplikacjach przed zamknięciem ogłoszenia. To
najgorsze doświadczenie kandydata w tym produkcie i największa rezerwa wzrostu w całym leju.

**5. Ogłoszenia z co najmniej jedną trafną rozmową — ma rosnąć.** Średnio 1,93 kontynuacji na
ogłoszenie, rozkładu nie znam. Poprawa: kompletność i porządek listy kandydatów na ogłoszeniach,
które nic nie dały. Jeśli zależność z ponownym zakupem jest progowa, to poprawa idzie z zera na
jedną, a nie z dwóch na trzy.

Guardraile, których nie optymalizuję, tylko pilnuję: mediana czasu do decyzji przesiewowej (2 dni) i
udział zaproszeń w aplikacjach (14,7%) — żeby dźwignie nie poprawiały się przez pośpiech ani przez
zapraszanie wyłącznie pewniaków.
