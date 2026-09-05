# Gastroführer — Projektstand (05.09.2026, v0.4.1)

## Was es ist
Eigenständige Browser-App (kein Login, kein O365/MSAL, keine Backend-Abhängigkeit),
ausgekoppelt aus dem Apriko-CRM (dort Spielwiese → Gastroführer, Stand CRM v1.91.0).
Design an das CRM angelehnt (CSS-Variablen, Dark/Light-Theme, .btn/.card/.toast) —
CRM-CSS noch nicht 1:1 übernommen, Variablen im `<style>` von index.html sind dafür vorbereitet.

## Deploy
- GitHub-Repo `benleuz/gastrospinne`, GitHub Pages aus `main` (Root).
- URL: https://benleuz.github.io/gastrospinne/
- Dateien im Root: `index.html`, `gastro.js`, `restaurants.json`, `PROJEKT-STAND.md`, `README.md`.
- Version in der Kopfzeile (#app-version) und in der Fusszeile («Gastroführer vX.Y.Z», Konstante
  GF_VERSION in gastro.js) — bei jedem Deploy erhöhen, inkl. `?v=`-Cache-Busting am Script-Tag.
- localStorage: Theme `gf-theme`, Wunschprofil `gf-wunsch`, umbenannte Kriterien `gf-labels`,
  Restaurants `gf-restaurants`, gewählte Art `gf-art`.

## Funktionsumfang v0.4.1
- Geführter Ablauf in drei Schritten:
  1. «Heute habe ich Lust auf …» – grosse Kacheln je Küchenart (Emoji, Anzahl Lokale),
     «Überrasch mich» = alle. Auswahl erscheint im Titel, scrollt zu Schritt 2.
  2. «Mir ist wichtig:» – Netzdiagramm (7 Achsen, 1–5, «egal»-Knopf am Achsentitel,
     Preisniveau/Günstig schliessen sich aus). ↺ Zurücksetzen.
  3. «Deine Treffer» – Ranking nach Passung (Rang, Prozent-Ring, Mini-Balken der Bewertung).
     Antippen legt das Lokal über das Netz.
- Datenmodell:
  - `restaurants.json` = Haupt-Rating des Gastroführers (Kurator), wird immer geladen (aktuell
    320 fiktive Zürcher Lokale).
  - Eigene Bewertung (✎) zu jedem Lokal überschreibt lokal das Kurator-Rating (localStorage
    `gf-own`, Badge «deine Bewertung», grüne Balken, entfernbar).
  - Eigene Restaurants (＋) mit eigener Bewertung (localStorage `gf-mine`, Badge «eigenes»).
- Teilen («Spotify-Stil»): Knopf «Teilen» kopiert einen Link mit Wunschprofil, Art, eigenen
  Bewertungen und eigenen Restaurants (URL-Hash `#s=…`, Base64-JSON). Empfänger bekommt einen
  Banner «Übernehmen / Nein danke». Ohne Backend, daher Link statt Konto.
- Sichern/Laden der eigenen Daten als JSON.
- localStorage: `gf-theme`, `gf-wunsch`, `gf-art`, `gf-own`, `gf-mine` (v0.3-Daten aus
  `gf-restaurants` werden migriert, Demo-Einträge verworfen).
- Kriterien sind fix (LABELS in gastro.js), Umbenennen entfernt.
- Mobile first (≤600 px): 3-spaltige Kacheln, Netz mit Kurztiteln (SHORT), grösseren
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
