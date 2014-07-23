#!/bin/bash

# $1 - database
# $2 - collection
# $3 - JSON array object

# TODO: Generalize (can give options for dev/test/dep/etc.),
# add validation
#
# Export JSON file $3 being array of document objects to MongoDB $1 database, $2 collection.

if [ "$4" == "flush" ]; then
	echo "Flushing $2 collection"
	mongo "$1" --eval "db.$2.remove({}); db.$2.count();"
fi

mongoimport --db "$1" --collection "$2" --jsonArray "$3"
