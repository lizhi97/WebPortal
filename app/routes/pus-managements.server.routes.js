'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var pusManagements = require('../../app/controllers/pus-managements.server.controller');

	// Pus managements Routes
	app.route('/pus-managements')
		.get(pusManagements.list)
		.post(users.requiresLogin, pusManagements.create);

	app.route('/pus-managements/:pusManagementId')
		.get(pusManagements.read)
		.put(users.requiresLogin, pusManagements.hasAuthorization, pusManagements.update)
		.delete(users.requiresLogin, pusManagements.hasAuthorization, pusManagements.delete);

	// Finish by binding the Pus management middleware
	app.param('pusManagementId', pusManagements.pusManagementByID);


};
