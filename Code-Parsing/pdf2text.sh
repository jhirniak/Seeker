#!/bin/bash

# $1 - source directory (only PDFs are taken into account)
# $2 - destination directory (only TXTs are generated)

shopt -s nullglob

START=`date +%s` # execution start time

PDF=("$1/*.pdf") # array of all PDFs

$OUTDIR=$(dirname {$2})
if [ ! -d "$OUTDIR" ]; then
  echo "Target directory $OUTDIR doesn't exist, creating..."
  mkdir -p "$OUTDIR"
fi

for pdf in $PDF
do
  bn=$(basename "$pdf")
  bn="${bn%.*}" # Extracted filename
  txt="$2$bn.txt" # Path to TXT file

  echo "$pdf => $txt"

  pdftotext -q -eol unix "$pdf" "$txt"
#  pdftotext -layout -q -eol unix "$pdf" "$txt-1"
#  pdftotext -htmlmeta -q -eol unix "$pdf" "$txt-2"
#  pdftotext -layout -htmlmeta -q -eol unix "$pdf" "$txt-3"
# -htmlmeta # tags like pre
# -bbox # detailed wrapping of each word
# -eol unix
# -q # do not print any messages or errors
# exit codes, 0 - no error, 1 - opening pdf file, 2 - output file, 3 - permissions, 99 - other
done

END=`date +%s`
RUNTIME=$((END-START))
echo "Finished transformation, in $RUNTIME s."
