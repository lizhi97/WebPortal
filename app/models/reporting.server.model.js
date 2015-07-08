'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Reporting Schema
 */
var ReportingSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Reporting name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Reporting', ReportingSchema);