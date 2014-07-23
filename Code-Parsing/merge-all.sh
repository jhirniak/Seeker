#!/bin/bash

# $1 - source directory
# $2 - output file path

#function join { local IFS="$1"; shift; echo "$*"; }
# echo `join ,  test/*js`

IN=("$1/*js")
OUT="$2.js"
FIRST=1

if [ -e $OUT ]; then
  echo "Output file $OUT exist, overwriting!"
  rm $OUT
  touch $OUT
fi

echo "[" >> $OUT

for F in $IN
do
  if [ ${FIRST} -eq 1 ]; then
    FIRST=0
  else
    echo "," >> $OUT
  fi

  cat $F >> $OUT
done

echo "]" >> $OUT
