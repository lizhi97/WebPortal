'use strict';

//Reportings service used to communicate Reportings REST endpoints
var myModule = angular.module('reportings');
myModule.factory('Reportings', ['$resource',
	function($resource) {
		return $resource('reportings/:reportingId', { reportingId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

myModule.factory('GetFPUS', ['$resource',
	function($resource){
		return $resource('/getLatestFailedTests');
	}
]);
myModule.factory('GetTop10Failure', ['$resource',
	function($resource){
		return $resource('/getTop10Failure');
	}
]);

myModule.factory('GetTeamReport', ['$resource',
	function($resource){
		return $resource('/getTeamReport');
	}
]);

myModule.factory('GetCreatedReport', ['$resource',
	function($resource){
		return $resource('/getCreatedReport');
	}
]);

myModule.factory('GetCreatedByDate', ['$resource',
	function($resource){
		return $resource('/getCreatedByDate');
	}
]);

myModule.factory('GetFailedPassedList', ['$resource',
	function($resource){
		return $resource('/getFailedPassedList');
	}
]);

myModule.factory('GetFailedPassedByDate', ['$resource',
	function($resource){
		return $resource('/getFailedPassedByDate');
	}
]);
