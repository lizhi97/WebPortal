'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Teammember = mongoose.model('Teammember'),
	_ = require('lodash');

/**
 * Get teams
 * @param req
 * @param res
 * @returns {*}
 */
//exports.getTeams = function(req, res) {
//	var teams = ['Tiger','Lion','Eagle','Deer'];
//	res.json(teams);
//};

/**
 * Create a Teammember
 */
exports.create = function(req, res) {
	var teammember = new Teammember(req.body);
	teammember.user = req.user;

	teammember.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(teammember);
		}
	});
};

/**
 * Show the current Teammember
 */
exports.read = function(req, res) {
	res.jsonp(req.teammember);
};

/**
 * Update a Teammember
 */
exports.update = function(req, res) {
	var teammember = req.teammember ;

	teammember = _.extend(teammember , req.body);

	teammember.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(teammember);
		}
	});
};

/**
 * Delete an Teammember
 */
exports.delete = function(req, res) {
	var teammember = req.teammember ;

	teammember.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(teammember);
		}
	});
};

/**
 * List of Teammembers
 */
exports.list = function(req, res) {
	Teammember.find().sort('-created').populate('user', 'displayName').exec(function(err, teammembers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(teammembers);
		}
	});
};

/**
 * Teammember middleware
 */
exports.teammemberByID = function(req, res, next, id) {
	Teammember.findById(id).populate('user', 'displayName').exec(function(err, teammember) {
		if (err) return next(err);
		if (! teammember) return next(new Error('Failed to load Teammember ' + id));
		req.teammember = teammember ;
		next();
	});
};

/**
 * Teammember authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.teammember.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
