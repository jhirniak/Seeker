'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Document Schema
 */
var DocumentSchema = new Schema({
    title: String,
    cycle: Number,
    section: [String]
});

module.exports = mongoose.model('docs', DocumentSchema); // docs is collection name

