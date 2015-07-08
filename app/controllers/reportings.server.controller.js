'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Reporting = mongoose.model('Reporting'),
	_ = require('lodash');

/**
 * Create a Reporting
 */
exports.create = function(req, res) {
	var reporting = new Reporting(req.body);
	reporting.user = req.user;

	reporting.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reporting);
		}
	});
};

/**
 * Show the current Reporting
 */
exports.read = function(req, res) {
	res.jsonp(req.reporting);
};

/**
 * Update a Reporting
 */
exports.update = function(req, res) {
	var reporting = req.reporting ;

	reporting = _.extend(reporting , req.body);

	reporting.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reporting);
		}
	});
};

/**
 * Delete an Reporting
 */
exports.delete = function(req, res) {
	var reporting = req.reporting ;

	reporting.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reporting);
		}
	});
};

/**
 * List of Reportings
 */
exports.list = function(req, res) { 
	Reporting.find().sort('-created').populate('user', 'displayName').exec(function(err, reportings) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reportings);
		}
	});
};

/**
 * Reporting middleware
 */
exports.reportingByID = function(req, res, next, id) { 
	Reporting.findById(id).populate('user', 'displayName').exec(function(err, reporting) {
		if (err) return next(err);
		if (! reporting) return next(new Error('Failed to load Reporting ' + id));
		req.reporting = reporting ;
		next();
	});
};

/**
 * Reporting authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.reporting.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
