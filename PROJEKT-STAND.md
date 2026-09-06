# Gastroführer — Projektstand (06.09.2026, v0.8.1)

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
- localStorage: `gf-theme`, `gf-wunsch`, `gf-art`, `gf-own`, `gf-kuratoren`, `gf-city`, `gf-kreise`,
  `gf-lang`, `gf-intro`.
- Kopfzeile: Titel, Version, Sprache DE/EN, Info (öffnet Konzept-Popup), Teilen, Theme.
- Zweisprachig DE/EN (Wörterbuch T in gastro.js, data-i18n im HTML, localStorage `gf-lang`,
  Vorbelegung nach Browsersprache). Übersetzt: alle UI-Texte, Kriterien, Küchenarten,
  Kuratoren-Bios (bio_en), Konzept-Popup. Restaurant-Notizen bleiben Deutsch (Daten).
- Konzept-/Einstiegsseite als Popup (dialog#intro, Text INTRO in gastro.js, Basis
  EINSTIEG-TEXT.md v2): erscheint beim ersten Besuch, «Los geht's» schliesst, localStorage
  `gf-intro`; jederzeit wieder über «Info». Eigene Kopfleiste im Popup mit DE/EN und ✕.

## Funktionsumfang v0.8.1
- Geführter Ablauf als Stufen (Zustand `step` = art | place | main, localStorage `gf-step`),
  es ist immer nur die aktuelle Stufe sichtbar:
  1. «Heute habe ich Lust auf …» – nur die Küchen-Kacheln. Antippen → Stufe 2.
  2. «Wo?» – nur Stadt-Dropdown + Kreis-Karte. Kreis antippen oder «Ganz Zürich» → Stufe 3.
  3. Hauptansicht: Netz (Wunschprofil) mit unauffälliger Zeile «Bewertungen von [Dropdown]»
     (Alle / Meine Liste / Gastroführer / Influencer, ⓘ = Prototyp-Hinweis; einzeilig, keine
     Legende «Mein Wunsch», mobil ohne Hinweistext und mit kompakterem Netz 680×600), darunter
     «Deine Treffer» (Ranking).
- Kopfzeile zeigt ab Stufe 2 die Wahl als Chips (🍕 Italienisch · 📍 Kreis 4); Antippen springt
  zur jeweiligen Stufe zurück. Mobil in einer zweiten Zeile.
- Restaurant antippen: Detail-Panel (Ring, Name, Meta, Notiz, Balken, ✎, Ausblenden) direkt
  unter dem Netz, Seite scrollt zur Spinne; Liste bleibt darunter.
- Kreis-Karte: Zahl je Kreis berücksichtigt die gewählte Art. Mehrere Kreise: nach dem ersten
  Antippen über den Chip zurück zur Karte und weitere wählen.
- Eigene Restaurants (＋), Design-Varianten, Sichern/Laden entfernt. Eigene Bewertungen (✎) bleiben.
- Reihenfolge der Bewertung: eigene > gewählte Kuratoren (Durchschnitt) > Haus-Rating.
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
- localStorage: `gf-theme`, `gf-wunsch`, `gf-art`, `gf-own`, `gf-kuratoren`, `gf-city`, `gf-kreise`, `gf-lang`, `gf-intro`.
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
