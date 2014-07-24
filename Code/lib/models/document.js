'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Document Schema
 */
var DocumentSchema = new Schema({
    filename: String,
    'report-language': String,
    source: String,
    cycle: Number,
    country: String,
    chapters: {},
    section: {},
    paragraphs: Array
});

module.exports = mongoose.model('Document', DocumentSchema, 'doc'); // doc is collection name

