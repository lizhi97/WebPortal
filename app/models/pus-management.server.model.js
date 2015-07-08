'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Pus management Schema
 */
var PusManagementSchema;
PusManagementSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Pus management name',
		trim: true
	},
	reviewer: {
		type: String,
		default: ''
		},
	team: {
		type: String,
		default: ''
	},
	creator: {
		type: String,
		default: ''
	},
	component: {
		type: String,
		default: ''
	},
	serverType: {
		type: String,
		default: ''
	},
	branch: {
		type: String,
		default: ''
	},
	testType: {
		type: String,
		default: ''
	},
	SUTHost:{
		type: String,
		default: ''
	},
	PUSStatus: {
		type: String,
		default: ''
	},
	runStatus:{
		type: Number,
		default: 1
	},
	disableToRun:{
		type: Boolean,
		default: false
	},
	run_log: [{ runDate: Date, status: String,
				runBuildNo: String,
				logFilePath: String,
				duration: String, errorNumbers: Number, warnings: Number,
				exceptions: Number, successes: Number,
				logfile:{
					type: Schema.ObjectId,
					ref: 'detailed_log'
				}, returnValue: String, errorMessage: String}],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});
var detailed_logSchema;
detailed_logSchema =  new Schema({
	PUSName: String,
	logFilePath: String,
	content: {
		type: String,
		default: ''
	}
});
mongoose.model('PusManagement', PusManagementSchema);
mongoose.model('detailed_log', detailed_logSchema);

