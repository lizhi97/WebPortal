'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Teammember Schema
 */
var TeammemberSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Teammember name',
		trim: true
	},
	team: {
		type: String,
		default: ''
	},
	email: {
		type: String,
		default: ''
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

mongoose.model('Teammember', TeammemberSchema);
