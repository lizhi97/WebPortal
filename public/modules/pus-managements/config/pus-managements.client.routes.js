'use strict';

//Setting up route
angular.module('pus-managements').config(['$stateProvider',
	function($stateProvider) {
		// Pus managements state routing
		$stateProvider.
		state('listPusManagements', {
			url: '/pus-managements',
			templateUrl: 'modules/pus-managements/views/list-pus-managements.client.view.html'
		}).
			state('tableTest', {
				url: '/pus-managements/tableTest',
				templateUrl: 'modules/pus-managements/views/tableTest.html'
			}).
		state('createPusManagement', {
			url: '/pus-managements/create',
			templateUrl: 'modules/pus-managements/views/create-pus-management.client.view.html'
		}).
		state('viewPusManagement', {
			url: '/pus-managements/:pusManagementId',
			templateUrl: 'modules/pus-managements/views/view-pus-management.client.view.html'
		}).
		state('editPusManagement', {
			url: '/pus-managements/:pusManagementId/edit',
			templateUrl: 'modules/pus-managements/views/edit-pus-management.client.view.html'
		});
	}
]);
