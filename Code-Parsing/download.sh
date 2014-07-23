#!/bin/bash

# $1 - file type
# $2 - URL
# $3 - destination

START=`date +%s`

wget -r -A "$1" -P "$2" "$3" --no-directories --timestamping

END=`date +%s`
RUNTIME=$((END-START))
echo "Downloaded all reports in $RUNTIME s."
