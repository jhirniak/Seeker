#!/bin/bash

# $1 - source directory
# $2 - output file path

#function join { local IFS="$1"; shift; echo "$*"; }
# echo `join ,  test/*js`

shopt -s nullglob

IN=("$1/*.json")
OUT="$2.json"
FIRST=1

OUTDIR=$(dirname ${OUT})

if [ ! -d "$OUTDIR" ]; then
  echo "Target directory $OUTDIR doesn't exist, creating..."
  mkdir -p "$OUTDIR"
fi

if [ -e "$OUT" ]; then
  echo "Output file $OUT exist, overwriting!"
  rm "$OUT"
fi

echo "Creating empty $OUT file..."
touch "$OUT"

echo "[" >> "$OUT"

for json in $IN
do
  echo "$json => $OUT"
  if [ ${FIRST} -eq 1 ]; then
    FIRST=0
  else
    echo "," >> "$OUT"
  fi

  cat "$json" >> "$OUT"
done

echo "]" >> "$OUT"
