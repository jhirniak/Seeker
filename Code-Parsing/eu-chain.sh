#!/bin/bash

# TODO: Generalize only to link and place in directories based on header

START=`date +%s`

# Download files from EU MinLang site into reports directory
./download.sh pdf reports http://www.coe.int/t/dg4/education/minlang/Report/default_en.asp

# Transform PDFs into TXTs
./pdf2text.sh reports reports-text/

# Transforms TXTs into JSONs
./text2json.sh reports-text reports-json/

# Merge into one JSON
./merge-all.sh reports-json reports-json-unified/Reports

# Upload to MongoDB
./upload2mongo.sh fullstack-dev doc reports-json-unified/Reports.json flush

END=`date +%s`
RUNTIME=$((END-START))
echo "Fetched PDFs and transformed them into JSON in $RUNTIME s."
