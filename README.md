# RISKUJ! - Svatba/Event Template

Jednoduchý, moderní a plně interaktivní projekt pro hru Riskuj (Jeopardy), postavený na HTML, CSS a JavaScriptu. Tento projekt je upraven do pastelových barev pro svatební účely, ale lze jej snadno přizpůsobit.

## Jak spustit projekt na GitHub Pages

Tento projekt je ideální pro hostování na GitHub Pages, protože je tvořen čistě statickými soubory.

1. **Vytvořte repository** na GitHubu.
2. **Nahrajte soubory** (`index.html`, `final.html`, `style.css`, `game_data.json`, `script.js`) do hlavní větve (main/master).
3. V nastavení repository (**Settings**) přejděte do sekce **Pages**.
4. V části **Build and deployment** vyberte jako zdroj (**Source**) možnost "Deploy from a branch".
5. Vyberte větev `main` (nebo `master`) a složku `/ (root)`.
6. Klikněte na **Save**.
7. Během chvilky bude vaše hra dostupná na adrese `https://vase-uzivatelske-jmeno.github.io/nazev-repository/`.

## Lokální spuštění

Vzhledem k tomu, že projekt nevyžaduje žádný build ani backend, stačí jej otevřít v prohlížeči.

1. Stáhněte/Naklonujte projekt.
2. Otevřete soubor `index.html` ve svém webovém prohlížeči.

## Struktura projektu

- `index.html`: Hlavní struktura aplikace a modální okna.
- `style.css`: Elegantní pastelový vzhled ideální pro svatby a oslavy.
- `game_data.json`: Obsahuje herní data (kategorie, otázky, odpovědi a body) ve formátu JSON.
- `script.js`: Logika hry, správa skóre, přepínání stavů a ovládání UI.

## Jak upravit otázky

Všechny otázky najdete v souboru `game_data.json`. Struktura vypadá následovně:

```json
{
  "categories": [
    {
      "name": "Název Kategorie",
      "bonus": {
        "question": "Bonusová otázka za 800 bodů?",
        "answer": "Odpověď"
      },
      "questions": [
        { "points": 100, "question": "Znění otázky?", "answer": "Odpověď" },
        // ... celkem 6 otázek (100-600)
      ]
    },
    // ... celkem 5 kategorií
  ],
  "final": [
    { "q": "Otázka pro rozstřel?", "a": "Odpověď" },
    // ... celkem 6 otázek
  ]
}
```

Chcete-li změnit počet řádků nebo sloupců, stačí přidat/odebrat objekty v `categories` nebo prvky v poli `questions`. UI se dynamicky přizpůsobí.

## Funkce

- **Variabilní počet týmů**: V nastavení můžete přidávat, odebírat a přejmenovávat týmy. Není zde žádný pevný limit na počet týmů.
- **Bodování a Aktivní tým**: Kliknutím na kartu týmu v bočním panelu jej označíte jako **aktivní** (na řadě - označen hvězdičkou). Body jsou tomuto týmu prioritně nabízeny v modálním okně.
- **Automatické střídání**: Po započítání bodů se aktivní tým automaticky přepne na dalšího v pořadí.
- **Ruční korekce**: Skóre lze upravit tlačítky +100/-100, nebo **kliknutím přímo na číslo skóre** pro ruční zadání libovolné hodnoty.
- **Zlatá cihla**: Speciální typ "otázky", který po otevření okamžitě nabízí body zdarma bez nutnosti odpovídat (obsahuje animaci).
- **Bonusové otázky**: Po vyčerpání sloupce se aktivuje hlavička s bonusovou otázkou za **800 bodů**.
- **Klávesové zkratky**: 
    - **Mezerník**: Zobrazit odpověď.
    - **Čísla (1-9)**: Přidělit body odpovídajícímu týmu v seznamu.
    - **Plus (+) / Mínus (-)**: Přidělit/odečíst body **aktivnímu týmu**.
    - **Esc**: Zavřít modální okno.
- **Responzivita a Zoom**: Hra je optimalizována pro zobrazení na projektoru. Layout se přizpůsobuje i při velkém přiblížení (zoomu) a modální okna umožňují scrollování, pokud je text příliš dlouhý.
- **Rozstřel**: Samostatná stránka s 10sekundovým časovačem pro finálové otázky. V okamžiku "STOP!" se vizuálně vyčistí pro maximální čitelnost.
- **Persistence**: Stav hry (body, použité otázky, aktivní tým) se ukládá v prohlížeči.
- **Konec hry**: Po vyčerpání všech otázek se zobrazí výsledková listina s efektem konfet.
