'use strict';

//Teammembers service used to communicate Teammembers REST endpoints
var myModule = angular.module('teammembers');
	myModule.factory('Teammembers', ['$resource',
		function($resource) {
			return $resource('teammembers/:teammemberId', { teammemberId: '@_id'
			}, {
				update: {
					method: 'PUT'
				}
			});
		}
	]);
	myModule.factory('GetTeams',['$resource',
		function($resource){
			return $resource('/teams');
		}
	]);
