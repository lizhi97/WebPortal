'use strict';

//Ldmscomponents service used to communicate Ldmscomponents REST endpoints
var myModule = angular.module('ldmscomponents');
	myModule.factory('Ldmscomponents', ['$resource',
		function($resource) {
			return $resource('ldmscomponents/:ldmscomponentId', { ldmscomponentId: '@_id'
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
