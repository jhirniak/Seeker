#!/bin/bash

# $1 - database
# $2 - collection
# $3 - JSON array object

# TODO: Generalize (can give options for dev/test/dep/etc.),
# add validation
#
# Export JSOn file Document.js being array of document objects to MongoDB fullstack-dev database, doc collection.
mongoimport --db "$1" --collection "$2" --jsonArray "$3"
