'use strict';

//Setting up route
angular.module('ldmscomponents').config(['$stateProvider',
	function($stateProvider) {
		// Ldmscomponents state routing
		$stateProvider.
		state('listLdmscomponents', {
			url: '/ldmscomponents',
			templateUrl: 'modules/ldmscomponents/views/list-ldmscomponents.client.view.html'
		}).
		state('createLdmscomponent', {
			url: '/ldmscomponents/create',
			templateUrl: 'modules/ldmscomponents/views/create-ldmscomponent.client.view.html'
		}).
		state('viewLdmscomponent', {
			url: '/ldmscomponents/:ldmscomponentId',
			templateUrl: 'modules/ldmscomponents/views/view-ldmscomponent.client.view.html'
		}).
		state('editLdmscomponent', {
			url: '/ldmscomponents/:ldmscomponentId/edit',
			templateUrl: 'modules/ldmscomponents/views/edit-ldmscomponent.client.view.html'
		});
	}
]);