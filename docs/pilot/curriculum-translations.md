# IntegratESG – Curriculum i quizy: aktualizacja tłumaczeń (WP3)

## Zakres

- 6 modułów, 4 jednostki na moduł i treści w 5 językach: `pl`, `de`, `it`, `el`, `bg`; angielska zawartość pozostaje bez zmian.
- Łącznie 150 przetłumaczonych materiałów Markdown (30 na język) i odnośniki do 42 osadzonych grafik z dokumentów Word.
- 24 quizy jednostkowe, 108 pytań i 332 odpowiedzi wraz z informacją zwrotną dla każdego języka.
- Identyfikatory pytań i odpowiedzi, klucz `isCorrect`, wyniki testów i dane użytkowników pozostają bez zmian.

## Pliki źródłowe

- `content/curriculum/<language>/module-N/{intro,unit-1,unit-2,unit-3,unit-4}.md`
- `content/curriculum/course-locales/<language>.json` – nazwy, opisy i informacje o jednostkach
- `content/curriculum/quiz-locales/<language>.json` – pytania, odpowiedzi, feedback
- `public/curriculum/media/<language>/` – obrazy używane przez dokumenty
- `prisma/seed-data/curriculum/localizations.js` – integracja tłumaczeń z modelem seed
- `prisma/seed-curriculum-translations.js` – niezależny, niedestrukcyjny importer danych językowych
- `tests/unit/curriculum/curriculum-localizations.test.js` – kontrola kompletności

## Przygotowanie

Pracuj na `feat/pilot-readiness`, bez zmian na `main`. Rozpakuj paczkę w katalogu głównym repozytorium. Nie używaj w bazie pilotażowej komendy `npm run db:seed` ani `node prisma/seed.js`: pełny seed usuwa i odtwarza jednostki oraz quizy.

```powershell
npm ci
npx prisma generate
node prisma/seed-curriculum-translations.js --check
npm run typecheck
npm run test:unit:run
npm run build
```

Test `--check` działa bez połączenia z bazą. Przed kolejnymi krokami wykonaj kopię bezpieczeństwa Supabase.

## Bezpieczne wgranie do Supabase

1. Potwierdź, że `DIRECT_URL` wskazuje właściwy projekt **pilotowy** (nie bazę E2E). Zmienna musi wskazywać działające połączenie PostgreSQL z uprawnieniami zapisu do tabel tłumaczeń.
2. Najpierw odczytowa kontrola rekordów:

```powershell
node prisma/seed-curriculum-translations.js --dry-run
```

3. Jeśli kontrola powiedzie się i masz kopię zapasową:

```powershell
node prisma/seed-curriculum-translations.js --apply
```

Importer weryfikuje przed zapisem wszystkie sześć kursów, kolejność i angielską treść 108 pytań oraz 332 odpowiedzi wraz z poprawnością. **Jeżeli model bazy różni się od katalogu źródłowego, przerywa bez zapisu.** Aktualizuje wyłącznie tabele `CourseTranslation`, `CourseSectionTranslation`, `QuizTranslation`, `QuestionTranslation` i `AnswerTranslation`. Operacje dla każdego kursu są transakcyjne. W razie przerwania import można bezpiecznie uruchomić ponownie.

Import nie jest automatycznie wykonywany przez `git push` lub `vercel deploy`.

## Kontrola po wdrożeniu

- Zaloguj się do aplikacji i przełącz każdy z sześciu modułów na PL/DE/IT/EL/BG.
- Sprawdź szczególnie grafikę i tabele w modułach 4–6, renderowanie alfabetów greckiego i bułgarskiego, a także wszystkie 4 quizy modułu 6 (łącznie z Prawda/Fałsz).
- W każdym języku poprawna odpowiedź musi być taka sama merytorycznie jak w wersji angielskiej. Nie wykonuj żadnego resetu postępów.
- Jeśli w trakcie importu wystąpi błąd weryfikacji spójności, **nie** używaj pełnego seeda do obejścia problemu.

## Ważne ograniczenia

Pliki zostały wygenerowane na podstawie dziesięciu dokumentów DOCX dostarczonych do tłumaczeń (po 2 na język). Poprawność językowa i aktualność twierdzeń merytorycznych wymagają akceptacji partnerów/autorów. Nie uruchamiano dostępu do bazy produkcyjnej ani pełnego buildu w środowisku przygotowania paczki.
