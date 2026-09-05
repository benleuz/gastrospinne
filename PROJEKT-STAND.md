# Gastroführer — Projektstand (05.09.2026, v0.2.0)

## Was es ist
Eigenständige Browser-App (kein Login, kein O365/MSAL, keine Backend-Abhängigkeit),
ausgekoppelt aus dem Apriko-CRM (dort Spielwiese → Gastroführer, Stand CRM v1.91.0).
Design an das CRM angelehnt (CSS-Variablen, Dark/Light-Theme, .btn/.card/.toast) —
CRM-CSS noch nicht 1:1 übernommen, Variablen im `<style>` von index.html sind dafür vorbereitet.

## Deploy
- GitHub-Repo `benleuz/gastrospinne`, GitHub Pages aus `main` (Root).
- URL: https://benleuz.github.io/gastrospinne/
- Dateien im Root: `index.html`, `gastro.js`, `PROJEKT-STAND.md`, `README.md`.
- Version in der Kopfzeile (#app-version) und in der Fusszeile («Gastroführer vX.Y.Z», Konstante
  GF_VERSION in gastro.js) — bei jedem Deploy erhöhen, inkl. `?v=`-Cache-Busting am Script-Tag.
- localStorage: Theme `gf-theme`, Wunschprofil `gf-wunsch`, umbenannte Kriterien `gf-labels`,
  Restaurants `gf-restaurants`, gewählte Art `gf-art`.

## Funktionsumfang v0.2.0
- Konzept: Gastroführer mit Suche über die Spinne. Ein Wunschprofil, Restaurants werden nach
  Passung sortiert.
- Kopfzeile: Dropdown «Art» (Japanisch, Chinesisch, Italienisch … + alle Arten aus den
  erfassten Restaurants), filtert die Liste. Theme-Umschalter.
- 7 Kriterien: Preisniveau, Ambiente, Weinkarte, Essen, Sehen und gesehen werden,
  Weitere Option 1, Weitere Option 2 — umbenennbar (Klick auf Namen in der Tabelle).
- Wunschprofil 1–5 (1 tief, 5 hoch) oder «egal» (nicht gewertet, Achse grau).
- Netzdiagramm (Radar, SVG) direkt bedienbar: Klick auf Stufenpunkt setzt Wert, Ziehen
  entlang der Achse verstellt, Klick auf Achsentitel toggelt «egal» (Wiedereinschalten → 3).
  Zurücksetzen (↺).
- Restaurants: Erfassen/Bearbeiten/Löschen im Dialog (Name, Ort, Art, Link, Notiz,
  Bewertung 1–5 je Kriterium). Speicherung im Browser (localStorage).
- Passung: 0–100 %, mittlere Abweichung zwischen Wunsch und Restaurant über alle
  nicht-«egal»-Kriterien. Liste sortiert nach Passung.
- Antippen eines Restaurants legt dessen Profil gestrichelt (orange) über das Netz.
- Sichern/Laden: alle Restaurants als JSON-Datei exportieren/importieren (Backup, Weitergabe,
  Wechsel Gerät/Browser).
- Eingeklappte Tabelle mit Knöpfen egal/1–5 für das Wunschprofil.

## Entfernt gegenüber v0.1.0
- Mehrfach-Profile (＋ Profil, Legende, Profil umbenennen/löschen).

## Ideen / offen
- CRM-CSS 1:1 übernehmen.
- Teilen: Wunschprofil als URL-Hash (#p=…) kodieren.
- Export als PNG/SVG des Netzes.
- Weitere Kriterien dynamisch hinzufügen/entfernen (aktuell fix 7 Achsen).
- Gemeinsame Restaurantliste (z.B. `restaurants.json` im Repo als Startbestand).

## Arbeitsweise (wie im CRM-Projekt)
- Kurze, präzise Korrekturen → sofortige gezielte Fixes, bei jeder Änderung Versionssprung,
  Version immer in den gelieferten Dateien sichtbar. Alles innerhalb GitHub (Pages).
- PROJEKT-STAND.md nur auf Zuruf mitliefern.
