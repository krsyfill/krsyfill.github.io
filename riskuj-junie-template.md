# RISKUJ – INTERACTIVE LOCALHOST TEMPLATE

## 1. Cíl projektu

Vytvoř jednoduchou, moderní a plně klikací webovou aplikaci typu **Riskuj / Jeopardy**, která slouží jako univerzální template pro moderátora kvízu.

Aplikace musí běžet lokálně na `localhost` a musí být použitelná bez backendu, databáze nebo přihlášení.

Priorita:
1. funkční interaktivita,
2. jednoduché ovládání během živého kvízu,
3. přehledný moderní vzhled,
4. snadná úprava otázek a kategorií,
5. žádná zbytečná technická složitost.

## 2. Realizovaný stack

Použitý jednoduchý frontendový stack:

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- JSON pro externí data
- Žádný build proces, žádný backend
- Stav aplikace držen v LocalStorage a JS stavu
- Projekt je spustitelný prostým otevřením `index.html` v prohlížeči.

## 3. Hlavní obrazovka

Výchozí obrazovka má působit jako profesionální digitální Riskuj.

### Horní část

- název hry, např. `RISKUJ!`
- menší podtitul: `Kvízová hra`
- tlačítko `Nastavení`
- případně tlačítko `Nová hra`

### Hrací plocha

Zobraz tabulku kategorií a bodových hodnot.

Výchozí konfigurace:

| Kategorie | 100 | 200 | 300 | 400 | 500 |
|---|---:|---:|---:|---:|---:|
| Historie | ? | ? | ? | ? | ? |
| Sport | ? | ? | ? | ? | ? |
| Film | ? | ? | ? | ? | ? |
| Hudba | ? | ? | ? | ? | ? |
| Věda | ? | ? | ? | ? | ? |

Každé políčko musí být klikatelné.

Po kliknutí se otevře otázka.

## 4. Otázka

Po výběru políčka zobraz otázku jako výrazný modal / fullscreen panel.

Musí být jasně vidět:

- název kategorie,
- hodnota otázky,
- samotná otázka,
- tlačítko `Zobrazit odpověď`.

Po kliknutí na `Zobrazit odpověď`:

- zobraz odpověď,
- nabídni volbu týmu, který odpověděl správně,
- nabídni možnost `Správně`
- nabídni možnost `Špatně`
- umožni otázku uzavřít.

### Důležité

Otázka se po použití označí jako použitá.

Použité políčko už nelze normálně znovu vybrat a vizuálně se odliší.

## 5. Týmy

Počet týmů musí být variabilní.

V nastavení umožni například:

- 2–8 týmů
- název každého týmu
- případně jednoduchou ikonu/avatar týmu

Výchozí stav:

- Tým 1
- Tým 2
- Tým 3
- Tým 4

Na hlavní obrazovce vždy zobraz skóre týmů.

Příklad:

`Tým 1    700 bodů`
`Tým 2    500 bodů`
`Tým 3    900 bodů`

## 6. Počítání bodů

Skóre musí být plně interaktivní.

Po vyhodnocení otázky musí být možné:

- přičíst hodnotu otázky vybranému týmu,
- odečíst hodnotu otázky vybranému týmu,
- případně otázku označit jako bez bodů.

Příklad:

Otázka za 300 bodů.

Tým 2 odpověděl správně:

`Tým 2 +300`

Tým 1 odpověděl špatně:

`Tým 1 -300`

Skóre může být záporné.

Změna skóre se musí okamžitě projevit na hlavní obrazovce.

## 7. Ruční úprava skóre

U každého týmu musí být možné skóre ručně upravit.

Například:

- `+100`
- `-100`
- `Upravit skóre`

To je důležité pro případ, že moderátor udělá chybu.

## 8. Data otázek

Otázky jsou uloženy v externím souboru:

`game_data.json`

Struktura je v JSON formátu, snadno pochopitelná a upravitelná.

Například:

```json
{
  "categories": [
    {
      "name": "Historie",
      "questions": [
        {
          "points": 100,
          "question": "Kdo byl prvním prezidentem České republiky?",
          "answer": "Václav Havel"
        }
      ]
    }
  ]
}
```

Umožni jednoduchou změnu:

- počtu kategorií,
- názvů kategorií,
- počtu otázek,
- hodnot,
- otázek,
- odpovědí.

## 9. Nastavení hry

Vytvoř samostatný panel `Nastavení`.

Musí obsahovat alespoň:

### Týmy
- přidat tým
- odebrat tým
- změnit název týmu
- změnit počáteční skóre

### Herní tabule
- možnost zobrazit aktuální počet kategorií
- možnost restartovat všechny otázky

### Hra
- `Nová hra`
- `Resetovat skóre`
- `Resetovat otázky`
- `Resetovat vše`

Před destruktivními akcemi zobraz jednoduché potvrzení.

## 10. Stav hry

Aplikace musí pracovat s těmito stavy:

```ts
teams
scores
usedQuestions
selectedQuestion
showAnswer
gameStarted
```

Preferuj čistou a jednoduchou state management logiku.

Není potřeba Redux.

## 11. UX během živého kvízu

Aplikace bude používána moderátorem na notebooku / PC před skupinou lidí.

Proto:

- tlačítka musí být velká,
- důležité informace musí být viditelné na první pohled,
- skóre musí být vždy dobře čitelné,
- otázka musí být čitelná z větší vzdálenosti,
- minimalizuj počet kliknutí,
- žádné zbytečné animace,
- žádné složité menu.

Klávesnice:

- `Esc` zavře modal,
- `Enter` může potvrdit / pokračovat,
- pokud je to jednoduché, implementuj také klávesové ovládání hrací plochy.

## 12. Vizuální styl

Vytvoř moderní vzhled inspirovaný televizní kvízovou soutěží.

Preferuj:

- tmavší pozadí,
- výrazné kontrastní herní karty,
- velkou typografii,
- jemné zaoblení,
- decentní stíny,
- jednoduché hover efekty.

Nemá to vypadat jako školní projekt.

Má to působit jako hotový produkt / dashboard.

### Responsivita

Primárně desktop.

Aplikace ale nesmí být rozbitá na menším displeji.

## 13. Herní flow

Typický scénář:

1. Moderátor otevře aplikaci.
2. Nastaví 3–6 týmů.
3. Přejmenuje týmy.
4. Klikne na první otázku.
5. Přečte otázku hráčům.
6. Klikne na `Zobrazit odpověď`.
7. Vybere tým.
8. Přičte / odečte body.
9. Zavře otázku.
10. Pokračuje výběrem dalšího políčka.

Tento flow musí být maximálně intuitivní.

## 14. Stav po použití otázky

Použitá otázka musí být vizuálně odlišná.

Například:

- snížená opacity,
- jiný odstín,
- odstranění hodnoty,
- ikona zaškrtnutí.

Neměla by být omylem znovu použitelná.

## 15. Konec hry

Přidej možnost `Konec hry`.

Po kliknutí zobraz:

- pořadí týmů,
- jejich skóre,
- vítězný tým,
- možnost `Hrát znovu`.

Seřaď týmy podle skóre.

## 16. Demo data

Aplikace musí po prvním spuštění obsahovat funkční demo.

Použij například 5 kategorií × 5 otázek.

Kategorie:

- Historie
- Sport
- Film
- Hudba
- Věda

Otázky mohou být jednoduché, ale musí být skutečně vyplněné, aby šlo okamžitě otestovat celý flow.

## 17. Architektura komponent

Navrhni rozumné komponenty, například:

```text
App
├── GameBoard
│   ├── CategoryHeader
│   └── QuestionCell
├── Scoreboard
│   └── TeamScore
├── QuestionModal
│   ├── QuestionView
│   └── AnswerView
├── SettingsModal
│   ├── TeamSettings
│   └── GameSettings
└── EndGameModal
```

Nechci ale zbytečnou abstrakci. Komponenty vytvářej podle skutečné potřeby.

## 18. Kvalita kódu

- TypeScript bez `any`, pokud to není opravdu nutné.
- Přehledné názvy.
- Žádný mrtvý kód.
- Žádné placeholdery typu `TODO` v hotové implementaci.
- Žádné hardcoded skóre v UI.
- Data hry odděl od UI.
- Herní logiku drž mimo prezentační JSX tam, kde je to rozumné.
- Nepoužívej backend.
- Nepoužívej databázi.

## 19. README

Projekt obsahuje `README.md`, který vysvětluje:

1. co projekt obsahuje,
2. jak spustit hru (GitHub Pages nebo lokálně),
3. kde upravit otázky,
4. jak fungují týmy a skóre.

## 20. Acceptance criteria

Projekt považuj za hotový až když:

- aplikace se otevře v prohlížeči z index.html,
- data se korektně načítají z game_data.json,
- je možné nastavit variabilní počet týmů,
- je možné přejmenovat týmy,
- skóre se správně počítá,
- skóre může být záporné,
- lze ručně opravit skóre,
- lze kliknout na každou otázku,
- lze zobrazit odpověď,
- otázku lze označit jako správnou / špatnou,
- použitá otázka nejde znovu otevřít,
- lze resetovat hru,
- existují demo otázky,
- existuje obrazovka výsledků,
- aplikace je vizuálně konzistentní,
- neobsahuje žádné nefunkční placeholdery.

## 21. Důležitý princip

Nechci pouze statický mockup.

Výsledkem musí být **skutečně funkční interaktivní template Riskuj**, který lze spustit na localhostu a během reálného kvízu používat jako moderátorskou aplikaci.

Současně ho navrhni tak, aby bylo později snadné přidat:

- timer na otázku,
- zvukové efekty,
- obrázky ve výkladu otázky,
- import otázek z JSON/CSV,
- fullscreen režim,
- dark/light theme,
- finálové kolo,
- více typů otázek.

Tyto funkce nyní NEIMPLEMENTUJ, pokud nejsou potřeba pro základní verzi. Připrav pouze čistou architekturu, která jejich pozdější přidání umožní.

## 22. Výstup

Vytvoř kompletní funkční projekt, ne pouze ukázkový kód.

Po dokončení:

1. spusť aplikaci,
2. ověř, že se buildne bez TypeScript chyb,
3. ověř hlavní herní flow,
4. oprav případné chyby,
5. stručně popiš, co bylo vytvořeno a jak projekt spustit.

Pokud musíš mezi jednoduchostí a množstvím funkcí volit, vždy preferuj **jednoduchou, stabilní a dobře použitelnou aplikaci**.
