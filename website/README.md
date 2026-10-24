# ROCHADE Website (statisch)

Landingpage und Prototyp von Francesco. Reines HTML, CSS und ES-Module, kein Build nötig.

```
python3 -m http.server 8765 --directory website
```

- `index.html` Landingpage mit belegten Zahlen, Quellen, Rechtslage, Sektionen für Verwaltungen und Bewohnende
- `app.html` Prototyp: 24 Haushalte, 3 Etappen, Regel-Planer (`js/planner.js`), Tests mit `node --test tests/*.test.js`
- `assets/` Marke «Doppelzug» als SVG, App-Screenshots aus `apps/web/public`

Farben und Typografie-Tokens in `css/tokens.css` entsprechen `packages/shared/src/tokens.ts`.
