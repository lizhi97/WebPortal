'use strict';

//Setting up route
angular.module('teammembers').config(['$stateProvider',
	function($stateProvider) {
		// Teammembers state routing
		$stateProvider.
		state('listTeammembers', {
			url: '/teammembers',
			templateUrl: 'modules/teammembers/views/list-teammembers.client.view.html'
		}).
		state('createTeammember', {
			url: '/teammembers/create',
			templateUrl: 'modules/teammembers/views/create-teammember.client.view.html'
		}).
		state('viewTeammember', {
			url: '/teammembers/:teammemberId',
			templateUrl: 'modules/teammembers/views/view-teammember.client.view.html'
		}).
		state('editTeammember', {
			url: '/teammembers/:teammemberId/edit',
			templateUrl: 'modules/teammembers/views/edit-teammember.client.view.html'
		});
	}
]);