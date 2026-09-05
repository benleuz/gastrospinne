# Gastroführer — Projektstand (05.09.2026, v0.6.0)

## Was es ist
Eigenständige Browser-App (kein Login, kein O365/MSAL, keine Backend-Abhängigkeit),
ausgekoppelt aus dem Apriko-CRM (dort Spielwiese → Gastroführer, Stand CRM v1.91.0).
Design an das CRM angelehnt (CSS-Variablen, Dark/Light-Theme, .btn/.card/.toast) —
CRM-CSS noch nicht 1:1 übernommen, Variablen im `<style>` von index.html sind dafür vorbereitet.

## Deploy
- GitHub-Repo `benleuz/gastrospinne`, GitHub Pages aus `main` (Root).
- URL: https://benleuz.github.io/gastrospinne/
- Dateien im Root: `index.html`, `gastro.js`, `restaurants.json`, `kuratoren.json`, `PROJEKT-STAND.md`, `README.md`.
- Version in der Kopfzeile (#app-version) und in der Fusszeile («Gastroführer vX.Y.Z», Konstante
  GF_VERSION in gastro.js) — bei jedem Deploy erhöhen, inkl. `?v=`-Cache-Busting am Script-Tag.
- localStorage: Theme `gf-theme`, Wunschprofil `gf-wunsch`, umbenannte Kriterien `gf-labels`,
  Restaurants `gf-restaurants`, gewählte Art `gf-art`.

## Funktionsumfang v0.6.0
- Geführter Ablauf in drei Schritten:
  1. «Heute habe ich Lust auf …» – grosse Kacheln je Küchenart (Emoji, Anzahl Lokale),
     «Überrasch mich» = alle. Auswahl erscheint im Titel, scrollt zu Schritt 2.
  2. «Mir ist wichtig:» – Netzdiagramm (7 Achsen, 1–5, «egal»-Knopf am Achsentitel,
     Schick/Günstig schliessen sich aus). ↺ Zurücksetzen.
  3. «Wem vertraue ich?» – Dropdown (#sel-kur): Alle, Meine Liste, Gastroführer (Haus-Rating),
     10 echte Zürcher (Liste eingebaut als DEFAULT_CURATORS in gastro.js; `kuratoren.json` optional als Override)
     Food-Influencer aus `kuratoren.json` (Name, Handle, Link; Quelle Falstaff 06/2025).
     Einfachauswahl; darunter Info-Karte (Avatar, Handle-Link, Kurzbeschrieb) zum Gewählten. ACHTUNG Prototyp: die Bewertungen der
     Influencer sind SIMULIERT (deterministische Abweichung ±1 vom Haus-Rating, curatorValues in
     gastro.js) – echte Bewertungen müssten von den Personen kommen oder das Feature muss vor
     Veröffentlichung umbenannt/entfernt werden.
  4. «Deine Treffer» – Ranking nach Passung (Rang, Prozent-Ring, Mini-Balken der Bewertung).
     Antippen legt das Lokal über das Netz. Reihenfolge der Bewertung: eigene > gewählte
     Kuratoren (Durchschnitt) > Haus-Rating.
- Datenmodell:
  - `restaurants.json` = Haupt-Rating des Gastroführers (Kurator), wird immer geladen (aktuell
    320 fiktive Zürcher Lokale).
  - Eigene Bewertung (✎) zu jedem Lokal überschreibt lokal das Kurator-Rating (localStorage
    `gf-own`, Badge «deine Bewertung», grüne Balken, entfernbar).
  - Eigene Restaurants (＋) mit eigener Bewertung (localStorage `gf-mine`, Badge «eigenes»).
- Teilen («Spotify-Stil»): Knopf «Teilen» kopiert einen Link mit Wunschprofil, Art, Kuratoren, eigenen
  Bewertungen und eigenen Restaurants (URL-Hash `#s=…`, Base64-JSON). Empfänger bekommt einen
  Banner «Übernehmen / Nein danke». Ohne Backend, daher Link statt Konto.
- Sichern/Laden der eigenen Daten als JSON.
- localStorage: `gf-theme`, `gf-wunsch`, `gf-art`, `gf-own`, `gf-mine`, `gf-kuratoren` (v0.3-Daten aus
  `gf-restaurants` werden migriert, Demo-Einträge verworfen).
- Kriterien sind fix (LABELS in gastro.js), Umbenennen entfernt.
- Mobile first (≤600 px): 3-spaltige Kacheln, Netz mit Kurztiteln (SHORT), viewBox 680×640 (Netz füllt die Breite), grösseren
  Punkten/«egal»-Knöpfen und Tap-Zielen ≥40 px, Seite über dem Netz weiterhin scrollbar
  (touch-action nur auf den Griffen), Dialog als Bottom-Sheet, schwebender Knopf
  «Treffer ansehen ↓», Safe-Area-Abstände. Netz zeichnet sich bei Resize neu.

## Ideen / offen
- CRM-CSS 1:1 übernehmen.
- Echtes Teilen mit Konto/Backend (Follower, öffentliche Listen) – im Prototyp nur Link.
- Kurator-Modus: eigene Bewertungen direkt als neue `restaurants.json` exportieren.
- Export als PNG/SVG des Netzes.
- Weitere Kriterien dynamisch hinzufügen/entfernen (aktuell fix 7 Achsen).
- Echte Restaurantdaten (z.B. OpenStreetMap/Overpass) statt fiktiver Beispiele.

## Arbeitsweise (wie im CRM-Projekt)
- Kurze, präzise Korrekturen → sofortige gezielte Fixes, bei jeder Änderung Versionssprung,
  Version immer in den gelieferten Dateien sichtbar. Alles innerhalb GitHub (Pages).
- PROJEKT-STAND.md nur auf Zuruf mitliefern.
