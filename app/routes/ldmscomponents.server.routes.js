'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var ldmscomponents = require('../../app/controllers/ldmscomponents.server.controller');
	var common = require('../controllers/common.server.controller.js');

	// Ldmscomponents Routes
	app.route('/ldmscomponents')
		.get(ldmscomponents.list)
		.post(users.requiresLogin, ldmscomponents.create);

	app.route('/ldmscomponents/:ldmscomponentId')
		.get(ldmscomponents.read)
		.put(users.requiresLogin, ldmscomponents.hasAuthorization, ldmscomponents.update)
		.delete(users.requiresLogin, ldmscomponents.hasAuthorization, ldmscomponents.delete);

	// Finish by binding the Ldmscomponent middleware
	app.param('ldmscomponentId', ldmscomponents.ldmscomponentByID);
	app.route('/teams')
		.get(common.getTeams)
		.post(users.requiresLogin);
};
