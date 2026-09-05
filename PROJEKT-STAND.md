# Gastroführer — Projektstand (05.09.2026, v0.1.0)

## Was es ist
Eigenständige Browser-App (kein Login, kein O365/MSAL, keine Backend-Abhängigkeit),
ausgekoppelt aus dem Apriko-CRM (dort Spielwiese → Gastroführer, Stand CRM v1.91.0).
Design 1:1 vom CRM übernommen (CSS-Variablen, Dark/Light-Theme, .btn/.card/.toast).

## Deploy (Ziel)
- Neues öffentliches GitHub-Repo, z.B. `benleuz/gastrofuehrer`, GitHub Pages aus `main` (Root).
- Dateien im Root: `index.html`, `gastro.js`, `PROJEKT-STAND.md`.
- Version in der Kopfzeile (#app-version) und im Kasten («Gastroführer vX.Y.Z», Konstante
  GF_VERSION in gastro.js) — bei jedem Deploy erhöhen, inkl. `?v=`-Cache-Busting am Script-Tag.
- Theme-Speicherung unter localStorage `gf-theme`, Profile unter `gf-profiles`, umbenannte
  Kriterien unter `gf-labels`.

## Funktionsumfang v0.1.0
- 7 Kriterien: Preisniveau, Ambiente, Weinkarte, Essen, Sehen und gesehen werden,
  Weitere Option 1, Weitere Option 2 — umbenennbar (Klick auf Namen in der Tabelle).
- Bewertung 1–5 (1 unwichtig, 5 sehr wichtig) oder «egal» (nicht gewertet, Achse grau).
- Netzdiagramm (Radar, SVG) direkt bedienbar: Klick auf Stufenpunkt setzt Wert, Ziehen
  entlang der Achse verstellt, Klick auf Achsentitel toggelt «egal» (Wiedereinschalten → 3).
- Mehrere Profile («＋ Profil»), überlagert; aktives Profil kräftig, andere gestrichelt.
  Umbenennen, löschen (✕), zurücksetzen (↺). Legende unten wechselt das aktive Profil.
- Eingeklappte Tabelle mit Knöpfen egal/1–5 als Alternative.

## Ideen / offen
- Restaurants als Datensätze (Name, Ort, Link) mit eigenem Profil, Abgleich gegen ein
  Wunschprofil (Ähnlichkeits-Score), Sortierung nach Passung.
- Teilen: Profil als URL-Hash (#p=…) kodieren, damit man ohne Speicherung Links versenden kann.
- Export als PNG/SVG des Netzes.
- Weitere Kriterien dynamisch hinzufügen/entfernen (aktuell fix 7 Achsen).

## Arbeitsweise (wie im CRM-Projekt)
- Kurze, präzise Korrekturen → sofortige gezielte Fixes, bei jeder Änderung Versionssprung,
  Version immer in den gelieferten Dateien sichtbar. Alles innerhalb GitHub (Pages).
- PROJEKT-STAND.md nur auf Zuruf mitliefern.
