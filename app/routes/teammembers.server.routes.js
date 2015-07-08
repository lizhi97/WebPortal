'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var teammembers = require('../../app/controllers/teammembers.server.controller');
	var common = require('../controllers/common.server.controller.js');

	// Teammembers Routes
	app.route('/teammembers')
		.get(teammembers.list)
		.post(users.requiresLogin, teammembers.create);

	app.route('/teammembers/:teammemberId')
		.get(teammembers.read)
		.put(users.requiresLogin, teammembers.hasAuthorization, teammembers.update)
		.delete(users.requiresLogin, teammembers.hasAuthorization, teammembers.delete);

	// Finish by binding the Teammember middleware
	app.param('teammemberId', teammembers.teammemberByID);
	//app.route('/teams')
	//	.get(common.getTeams)
	//	.post(users.requiresLogin, teammembers.create);
};
