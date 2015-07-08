'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Ldmscomponent Schema
 */
var LdmscomponentSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Ldmscomponent name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	team: {
		type: String,
		default: ''
	},
	totalTests: {
		type: Number,
		default:''
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Ldmscomponent', LdmscomponentSchema);
