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
        "question": "Bonusová otázka za 700 bodů?",
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

- **Variabilní počet týmů**: V nastavení můžete přidávat, odebírat a přejmenovávat týmy.
- **Bodování**: Po zobrazení odpovědi můžete body přičíst (+) nebo odečíst (-) vybranému týmu.
- **Ruční korekce**: Skóre lze u každého týmu kdykoliv upravit tlačítky +100/-100 v bočním panelu.
- **Bonusové otázky**: Po vyčerpání sloupce se aktivuje hlavička s bonusovou otázkou za 700 bodů.
- **Rozstřel**: Samostatná stránka s časovačem pro rychlé finálové otázky.
- **Persistence**: Stav hry (body, použité otázky) se ukládá v prohlížeči, takže se neztratí při náhodném obnovení stránky.
- **Konec hry**: Po vyčerpání všech otázek se zobrazí výsledková listina s vítězem.
- **Restart**: Možnost kdykoliv resetovat celou hru.
