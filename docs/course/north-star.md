# North Star dla DoRoboty.ai

Wersja do wklejenia w odpowiedź kursową. Pełna analiza z testami i zastrzeżeniami:
[docs/tasks/north-star-metric.md](../tasks/north-star-metric.md).

---

## Jaka to gra: transakcje

DoRoboty.ai to rynek, na którym spotykają się kandydat i firma. Wartość pojawia się wtedy, kiedy
dobiorą się we właściwą parę — więc gramy w transakcje.

Nie w uwagę, czyli czas spędzony w produkcie: rekruter ma kilkadziesiąt aplikacji na ogłoszenie i
decyduje zwykle w dwa dni, więc jeśli siedzi u nas dłużej, to znaczy, że się zaciął. Nie w
produktywność, choć przesiewanie jest zadaniem do wykonania: produkt daje dostęp do drugiej strony
rynku, a mierząc sprawność przesiewu zgubiłabym z metryki kandydata.

Transakcją jest dopasowanie, nie zakup ogłoszenia. Firma płaci z góry, więc zakup mówi tylko tyle, że
zapłaciła — nie, że coś z tego miała.

## Główna metryka: trafne rozmowy

Liczę, ile razy w tygodniu doszło do pierwszej rozmowy, po której pracodawca powiedział „idziemy
dalej z tą osobą".

Jak to liczę: jeden kandydat na jednym ogłoszeniu, policzony raz. Zaliczam, kiedy w ciągu 35 dni po
rozmowie pojawiła się decyzja o kontynuacji (zwykle zapada po 9 dniach). Liczy się tylko pierwsza
rozmowa, żeby firma nie podbiła metryki samym dodaniem kolejnych etapów. Dzisiaj wychodzi około 48
rozmów na tydzień. Patrzę na to razem z tym, ile takich rozmów wypada na jedno ogłoszenie (teraz
1,93), bo inaczej nie odróżnię poprawy produktu od tego, że po prostu przyszło więcej klientów.

Dlaczego to pokazuje wartość: to jedyny moment, w którym wygrywają obie strony naraz. Firma znalazła
kogoś wartego dalszej rozmowy, a kandydat trafił tam, gdzie jego doświadczenie faktycznie pasuje.
Nie da się tego podkręcić ładniejszym pisaniem — a Match Score dało się: wzrósł z 68 na 78 punktów,
a zaproszeń i kontynuacji było mniej.

Dlaczego to sygnał na przyszłość: firma kupuje kolejne ogłoszenie za to, co dało jej poprzednie.
Trafną rozmowę widzę po około 5 tygodniach, a ponowny zakup dopiero po 13 — mam więc informację
jakieś dwa miesiące wcześniej. Coś na to wskazuje: w czerwcu 2026 kontynuacje spadły z 33,6 na 30,1
procent i wtedy właśnie ponowne zakupy spadły z 45 na 30, a Match Score w tym czasie rósł. To jedna
obserwacja, więc traktuję ją jako przypuszczenie — sprawdzę je, porównując firmy bez ani jednej
trafnej rozmowy z tymi, które ją miały.

## Co możemy poprawiać

**1. Konkret w aplikacji — w górę.** Ile aplikacji ma wypełnione „Efekt" i „Jak to sprawdzono"
własnymi słowami kandydata. Zrobi to ekran, na którym asystent dopyta o te dwie rzeczy, a kandydat
zatwierdzi kartę przed wysłaniem. Nie liczę samych wypełnionych pól, bo Kuba i Natalia mają po 3 z 4
i licznik ich nie odróżnił.

**2. Trafność zaproszeń — w górę.** Ile pierwszych rozmów kończy się kontynuacją; dziś 32,7 procent.
Pomoże karta zakresu na górze aplikacji i lista kandydatów ułożona po tym, co w kartach, a nie po
Match Score. Wzrost do 38 procent to 56 trafnych rozmów zamiast 48, bez jednej dodatkowej rozmowy.

**3. Odkładane aplikacje — w dół.** Rekruter odkłada „na później" 17 procent aplikacji, ponad 200
tygodniowo. Karta ma mu pozwolić zdecydować od razu; warto też przypominać o odłożonych, zanim
ogłoszenie się zamknie.

**4. Aplikacje bez żadnej odpowiedzi — w dół.** 43 procent aplikacji nie dostaje nawet decyzji, około
570 tygodniowo. To najgorsze, co kandydat może u nas przeżyć, i jednocześnie największy zapas.

**5. Ogłoszenia z choć jedną trafną rozmową — w górę.** Średnio wypada 1,93 na ogłoszenie. Najwięcej
do zyskania jest tam, gdzie nie ma ani jednej, więc nad takimi ogłoszeniami warto pracować osobno.

Pilnuję przy tym dwóch rzeczy, żeby poprawa nie była pozorna: czasu do decyzji (dziś 2 dni — żeby
rekruter nie zaczął odrzucać wszystkiego w pośpiechu) i udziału zaproszeń (14,7 procent — żeby nie
zapraszał tylko pewniaków).
