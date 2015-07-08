'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var reportings = require('../../app/controllers/reportings.server.controller');

	// Reportings Routes
	app.route('/reportings')
		.get(reportings.list)
		.post(users.requiresLogin, reportings.create);

	app.route('/reportings/:reportingId')
		.get(reportings.read)
		.put(users.requiresLogin, reportings.hasAuthorization, reportings.update)
		.delete(users.requiresLogin, reportings.hasAuthorization, reportings.delete);

	// Finish by binding the Reporting middleware
	app.param('reportingId', reportings.reportingByID);
};
