'use strict';

//Pus managements service used to communicate Pus managements REST endpoints
var myModule = angular.module('pus-managements');
	myModule.factory('PusManagements', ['$resource',
		function($resource) {
			return $resource('pus-managements/:pusManagementId', { pusManagementId: '@_id'
			}, {
				update: {
					method: 'PUT'
				}
			});
		}
	]);
	myModule.factory('getTeamNames', ['$resource',
		function($resource) {
			return $resource('/teamNames');
		}
	]);
	myModule.factory('getComponents', ['$resource',
		function($resource) {
			return $resource('/components');
		}
	]);
	myModule.factory('GetTeams',['$resource',
		function($resource){
			return $resource('/teams');
		}
	]);



