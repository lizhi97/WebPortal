
'use strict';

var myModule = angular.module('pus-managements');
myModule.filter('millSecondsToTimeString', function() {
			return function(millseconds) {
				// Minutes and seconds
				var time = parseFloat(millseconds);
				var mins = ~~(time / 60);
				var secs = time % 60;
// Hours, minutes and seconds
				var hrs = ~~(time / 3600);
				 mins = ~~((time % 3600) / 60);
				 secs = Math.round(time % 60);
// Output like "1:01" or "4:03:59" or "123:03:59"
				var ret = '';
				if (hrs > 0)
					ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
				ret += '' + mins + ':' + (secs < 10 ? '0' : '');
				ret += '' + secs;
				return ret;
			};
	});
myModule.filter('percentage', ['$filter', function ($filter) {
	return function (input, decimals) {
		return $filter('number')(input * 100, decimals) + '%';
	};
}]);

myModule.filter('formatter', function () {
	return function (inputArray) {
		angular.forEach(inputArray,function(item,index){
			item.runDate = new Date(item.runDate)
		});
		return inputArray;
	};
});
