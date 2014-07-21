'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Document Schema
 */
var DocumentSchema = new Schema({
    title: String,
    cycle: Number,
    country: String,
    section: [String]
});

module.exports = mongoose.model('Document', DocumentSchema, 'doc'); // doc is collection name

