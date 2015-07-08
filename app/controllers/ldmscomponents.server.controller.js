'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Ldmscomponent = mongoose.model('Ldmscomponent'),
	_ = require('lodash');

/**
 * Create a Ldmscomponent
 */
exports.create = function(req, res) {
	var ldmscomponent = new Ldmscomponent(req.body);
	ldmscomponent.user = req.user;

	ldmscomponent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ldmscomponent);
		}
	});
};

/**
 * Show the current Ldmscomponent
 */
exports.read = function(req, res) {
	res.jsonp(req.ldmscomponent);
};

/**
 * Update a Ldmscomponent
 */
exports.update = function(req, res) {
	var ldmscomponent = req.ldmscomponent ;

	ldmscomponent = _.extend(ldmscomponent , req.body);

	ldmscomponent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ldmscomponent);
		}
	});
};

/**
 * Delete an Ldmscomponent
 */
exports.delete = function(req, res) {
	var ldmscomponent = req.ldmscomponent ;

	ldmscomponent.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ldmscomponent);
		}
	});
};

/**
 * List of Ldmscomponents
 */
exports.list = function(req, res) {
	Ldmscomponent.find().sort('-created').populate('user', 'displayName').exec(function(err, ldmscomponents) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ldmscomponents);
		}
	});
};

/**
 * Ldmscomponent middleware
 */
exports.ldmscomponentByID = function(req, res, next, id) {
	Ldmscomponent.findById(id).populate('user', 'displayName').exec(function(err, ldmscomponent) {
		if (err) return next(err);
		if (! ldmscomponent) return next(new Error('Failed to load Ldmscomponent ' + id));
		req.ldmscomponent = ldmscomponent ;
		next();
	});
};

/**
 * Ldmscomponent authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.ldmscomponent.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
