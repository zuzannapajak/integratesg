# Pilotaż Curriculum: sześć modułów / Module coverage

## Rozróżnienie wskaźników

Zgodnie z WP3 _Guidelines for Piloting of the Curriculum and Modules_ (wersja 0.1),
„Module coverage: 6 modules” oznacza zakres zbadanych modułów w całym pilotażu,
a **nie** obowiązek ukończenia trzech (ani sześciu) modułów przez jednego uczestnika.
Wskaźnik w panelu jest operacyjną, rygorystyczną interpretacją: moduł jest
„covered”, gdy ukończył go co najmniej jeden uczestnik formalnej ścieżki.
Samo otwarcie strony lub rozpoczęcie kursu nie liczy się jako ukończenie.

## Rozłożenie obciążenia

Po zakończeniu pre-assessment uczestnicy otrzymują dwa **rekomendowane** moduły,
z przydziałem rotacyjnym według daty ukończenia pre-assessment, a następnie ID użytkownika:

1. uczestnik: moduły 1 i 4, 2.: moduły 2 i 5, 3.: moduły 3 i 6,
   4.: znów 1 i 4 itd. Rekomendacje są stabilne po dodaniu następnych uczestników
   (jeśli wcześniejsze timestampy nie są wstecznie zmieniane). Wciąż dostępne są
   wszystkie sześć modułów. Nie ma losowania jedynego widocznego modułu ani
   zablokowania pozostałych pięciu.

To rozłożenie jest **propozycją realizacyjną**, nie oficjalnym wymogiem WP3.
Przed pilotażem należy uzgodnić wymagany zakres pracy uczestników z koordynatorem.

## Zakres raportu

Tylko osoby, które **ukończyły pre-assessment**, wchodzą do licznika pokrycia.
Wyniki zaliczamy tylko dla prób rozpoczętych nie wcześniej niż ukończenie
pre-assessment; historyczna aktywność testowa sprzed pre-assessment jest wykluczana.
Przy brakujących znacznikach czasu nie zaliczamy próby automatycznie.
Analityka pokazuje osobno liczbę osób, którym dany moduł polecono, które go rozpoczęły,
które ukończyły i które ukończyły go z grupy rekomendowanej. Użytkownicy bez pre-assessment
(nawet gdy eksplorują platformę) nie zanieczyszczają danych pilotażu.

## Zgodność wsteczna i ograniczenia

- Bez migracji i bez aktualizacji danych w Supabase.
- Nie zmieniono wymagania >= 1 ukończonego modułu do odblokowania post-assessment.
  Nie podnosimy go bez zatwierdzenia metodologii. Użytkownik nadal może
  pominąć pre-assessment i korzystać z platformy **poza formalnym pilotażem**;
  nie może wtedy wypełnić post-assessment.
- To jest rekomendacja wyliczana z chronologii zgłoszeń, nie zapisany przydział
  organizatora. Nie jest odporna na ręczne cofnięcie dat ukończenia pre-assessment
  ani import starszych zgłoszeń. Jeśli w przyszłości konieczna będzie edycja
  przydziałów i trwałość niezależna od historii, trzeba dodać osobny model Prisma.
- Rzeczywista metodologia WP3 przewiduje dodatkowo warsztat i ankietę satysfakcji;
  tego ten etap **nie implementuje**.

## Kontrola przed wdrożeniem

Uruchom `npx prisma generate`, `npm run typecheck`, `npm run test:unit:run`,
`npm run build`. Przetestuj panel `/{locale}/admin/curriculum-pilot` i stronę
`/{locale}/curriculum` na koncie uczestnika z wypełnionym pre-assessment.
Potwierdź, że w Supabase jest dokładnie sześć opublikowanych kursów.
