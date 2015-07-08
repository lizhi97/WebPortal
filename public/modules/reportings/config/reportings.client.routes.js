'use strict';

//Setting up route
angular.module('reportings').config(['$stateProvider',
	function($stateProvider) {
		// Reportings state routing
		$stateProvider.
			state('ShowFailedPUS', {
				url: '/reportings/ShowFailedPUS',
				templateUrl: 'modules/reportings/views/showFailedPUS.html'
			}).
			state('list-top10failed', {
				url: '/reportings/list-top10failed',
				templateUrl: 'modules/reportings/views/list-top10failed.client.view.html'
			}).
			state('list-failedPassed', {
				url: '/reportings/list-failedPassed',
				templateUrl: 'modules/reportings/views/list-failedPassed.client.view.html'
			}).
			state('list-failedPassedByDate', {
				url: '/reportings/list-failedPassedByDate',
				templateUrl: 'modules/reportings/views/list-failedPassedByDate.client.view.html'
			}).
			state('viewProgress', {
				url: '/reportings/viewProgress',
				templateUrl: 'modules/reportings/views/progressByMonth.client.view.html'
			}).
			state('viewTeam', {
				url: '/reportings/viewTeam',
				templateUrl: 'modules/reportings/views/viewTeam.client.view.html'
			});

	}
]);
