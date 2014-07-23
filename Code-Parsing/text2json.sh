#!/bin/bash

# $1 - source directory (only TXTs are taken into account)
# $2 - destination directory (only JSONs are generated)

shopt -s nullglob

START=`date +%s` # execution start time

TXT=("$1/*.txt") # array of all PDFs

$OUTDIR=$(dirname ${$2})
if [ ! -d "$OUTDIR"]; then
  echo "Target directory $OUTDIR doesn't exist, creating..."
  mkdir -p "$OUTDIR"
fi

for txt in $TXT
do
  bn=$(basename "$txt")
  bn="${bn%.*}" # Extracted filename
  json="$2$bn.json" # Path to TXT file

  echo "$txt => $json"

  ./text2json.py "$txt" > "$json"

# exit codes, 0 - no error, 1 - opening pdf file, 2 - output file, 3 - permissions, 99 - other
done

END=`date +%s`
RUNTIME=$((END-START))
echo "Finished transformation to JSON, in $RUNTIME s."
