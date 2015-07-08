'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	PusManagement = mongoose.model('PusManagement'),
	_ = require('lodash');

/**
 * Create a Pus management
 */
exports.create = function(req, res) {
	var pusManagement = new PusManagement(req.body);
	pusManagement.user = req.user;

	pusManagement.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pusManagement);
		}
	});
};

/**
 * Show the current Pus management
 */
exports.read = function(req, res) {
	res.jsonp(req.pusManagement);
};

/**
 * Update a Pus management
 */
exports.update = function(req, res) {
	var pusManagement = req.pusManagement ;
	pusManagement = _.extend(pusManagement , req.body);

	pusManagement.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pusManagement);
		}
	});
};

/**
 * Delete an Pus management
 */
exports.delete = function(req, res) {
	var pusManagement = req.pusManagement ;

	pusManagement.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pusManagement);
		}
	});
};

/**
 * List of Pus managements
 */
exports.list = function(req, res) {
	PusManagement.find().select({ 'name': 1, 'team': 1,'creator' :1,'component':1,
		'PUSStatus':1,'SUTHost':1,'disableToRun':1,'created':1,'_id':1})
		.sort('-created').populate('user', 'displayName').exec(function(err, pusManagements) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pusManagements);
		}
	});
};

/**
 * Pus management middleware
 */
exports.pusManagementByID = function(req, res, next, id) {
	PusManagement.findById(id).sort({date: 'desc'}).populate('user', 'displayName').exec(function(err, pusManagement) {
		if (err) return next(err);
		if (! pusManagement) return next(new Error('Failed to load Pus management ' + id));
		req.pusManagement = pusManagement ;
		next();
	});
};

/**
 * Pus management authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.pusManagement.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
