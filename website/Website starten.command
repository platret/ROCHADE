#!/bin/bash
# ROCHADE: Website lokal starten und im Browser öffnen. Doppelklick genügt.
# Die Seite braucht einen Webserver, weil sie JavaScript-Module lädt; per Doppelklick auf index.html geht das nicht.
PORT=8765
DIR="$(cd "$(dirname "$0")" && pwd)"
# Nie aus OneDrive servieren: dort werden Dateien entleert und lassen sich dann nicht lesen.
case "$DIR" in *CloudStorage*) DIR="$HOME/Developer/ROCHADE/website" ;; esac
if [ ! -f "$DIR/index.html" ]; then echo "Ordner nicht gefunden: $DIR"; read -r -p "Enter zum Schliessen"; exit 1; fi
if ! lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; then
  (cd "$DIR" && nohup python3 -m http.server $PORT --bind 127.0.0.1 >/dev/null 2>&1 &)
  sleep 1
fi
open "http://localhost:$PORT/index.html"
echo
echo "ROCHADE läuft: http://localhost:$PORT/index.html   (Prototyp: http://localhost:$PORT/app.html)"
echo "Ordner: $DIR"
echo "Dieses Fenster kann geschlossen werden, der Server läuft weiter."
