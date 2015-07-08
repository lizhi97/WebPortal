'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication','GetPUSData','GetFailedFinishedPUS','GetFinishedAllPUS',
	function($scope, Authentication,GetPUSData,GetFailedFinishedPUS,GetFinishedAllPUS) {
		// This provides Authentication context.
		//$scope.authentication = Authentication;
		$scope.getComponentData = function () {
			var myObject = [];
			var displayedCollection = {};
			Array.prototype.functionName = function () {
				var i = 0;
				this.forEach(function (item) {
					myObject[i] = item;
					i++;
				});
			};

			GetPUSData.query().$promise.then(
				function (data) {
					data.functionName();
					//$scope.rowCollection = myObject;
					//console.log(myObject);
					var i = 0;
					var failedCount = [];
					var finishedCount = [];
					var totalCount = [];
					myObject.forEach(function (componentValues) {
						var oneFailedCount = [];
						var oneFinishedCount = [];
						var oneTotalCount = [];
						oneFailedCount[0] = componentValues.Component;
						oneFailedCount[1] = componentValues.failedCount;

						oneFinishedCount[0] = componentValues.Component;
						oneFinishedCount[1] = componentValues.FinishedCount;

						oneTotalCount[0] = componentValues.Component;
						oneTotalCount[1] = componentValues.totalPUS;

						failedCount[i] = oneFailedCount;
						finishedCount[i] = oneFinishedCount;
						totalCount[i] = oneTotalCount;
						i++;
					});
					var exampleData = [],
						allData = {},
						failedData = {},
						finishedData = {},
						totalData = {};

					failedData.key = 'Failure';
					failedData.values = failedCount;

					finishedData.key = 'Finished';
					finishedData.values = finishedCount;

					totalData.key = 'All';
					totalData.values = totalCount;

					//allData = {}.concat(failedData).concat(finishedData).concat(totalData);

					exampleData[0] = failedData;
					exampleData[1] = finishedData;
					exampleData[2] = totalData;
					$scope.exampleData = exampleData;
					//	console.log(exampleData);

					//console.log(myObject);
					//$scope.displayedCollection = [].concat($scope.rowCollection);
				});
			var colorArray = ['#E63133', '#008000', '#FF9F4A'];
			$scope.componentColor = function() {
				return function(d, i) {
					return colorArray[i];
				};
			};
			$scope.toolTipContent = function(){
				return function(key, x, y, e, graph) {
					return  'Super New Tooltip' +
						'<h1>' + key + '</h1>' +
						'<p>' +  y + ' at ' + x + '</p>';
				};
			};


		};
		$scope.finishedFailureAll = function() {
			var finishedFaliure = [];
			Array.prototype.functionName = function () {
				var i = 0;
				this.forEach(function (item) {
					finishedFaliure[i] = item;
					//console.log(item);
					i++;
				});
			};
			GetFailedFinishedPUS.query().$promise.then(
				function (data1) {
					data1.functionName();
					var leftFinished = data1[2] - data1[1];
					leftFinished -= data1[0];
					$scope.exampleData1 = [
						{ key: 'Not Run', y: data1[0] },
						{ key: 'Failure', y: data1[1] },
						{ key: 'Finished', y: leftFinished }
					];
					//$scope.displayedCollection = [].concat($scope.rowCollection);
				}
			);
			var colorArray = ['#F0F000','#E63133',  '#008000'];
			$scope.FFColor = function() {
				return function(d, i) {
					return colorArray[i];
				};
			};
		};



		$scope.finishedAll = function() {
			var finishedAll = [];
			Array.prototype.functionName = function () {
				var i = 0;
				this.forEach(function (item) {
					finishedAll[i] = item;
					//console.log(item);
					i++;
				});
			};
			GetFinishedAllPUS.query().$promise.then(
				function (data) {
					data.functionName();
					//console.log(data[0]);
					//console.log(data[1]);
					$scope.finishedAllData = [
						{ key: 'Automated', y: data[0] },
						{ key: 'Not automated', y: data[1]-data[0] }
					];
					//$scope.displayedCollection = [].concat($scope.rowCollection);
				}
			);
			var colorArray = ['#0180FE',  '#AFBCC9'];
			$scope.FAColor = function() {
				return function(d, i) {
					return colorArray[i];
				};
			};
		};




		$scope.xFunction = function(){
			return function(d) {
				return d.key;
			};
		};
		$scope.yFunction = function(){
			return function(d) {
				return d.y;
			};
		};
		var format = d3.format(',.1f');
		$scope.valueFormatFunction = function(){
			return function(d){
				return format(d);
			};
		};
	}

]);
