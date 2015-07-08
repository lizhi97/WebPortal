/**
 * Created by Joe on 3/28/15.
 */
'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var teammembers = require('../../app/controllers/teammembers.server.controller');
	var common = require('../controllers/common.server.controller.js');


	app.route('/teams')
		.get(common.getTeams)
		.post(users.requiresLogin);
	app.route('/components')
		.get(common.getComponents)
		.post(users.requiresLogin);
	app.route('/teamNames')
		.get(common.getTeamNames)
		.post(users.requiresLogin);
	app.route('/PUS-tests')
		.get(common.testRead);
	app.route('/Process_log')
		.get(common.process_log);
	app.route('/getRunlogDetailed')
		.get(common.getRunlogDetailed);
	app.route('/getLatestFailedTests')
		.get(common.getLatestFailedTests);
	app.route('/getSumaryData')
		.get(common.getSumary);
	app.route('/getFinishedFailedPUS')
		.get(common.getFinishedFailedPUS);
	app.route('/getFinishedAllPUS')
		.get(common.getFinishedAllPUS);
	app.route('/getAllLogs')
		.get(common.getAllLogs);
	app.route('/getTop10Failure')
		.get(common.getTop10Failure);
	app.route('/getTeamReport')
		.get(common.getTeamReport);
	app.route('/getCreatedReport')
		.get(common.getCreatedReport);
	app.route('/getCreatedByDate')
		.get(common.getCreatedByDate);
	app.route('/getCreatedByMonth')
		.get(common.getCreatedByMonth);
	app.route('/getFailedPassedList')
		.get(common.getFailurePassedList);
	app.route('/getFailedPassedByDate')
		.get(common.getFailurePassedByeDate);
};
