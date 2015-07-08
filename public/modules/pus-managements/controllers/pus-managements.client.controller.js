'use strict';

// Pus managements controller
angular.module('pus-managements').controller('PusManagementsController', ['$scope', '$stateParams',
	'$location','$q', 'Authentication', 'PusManagements','getTeamNames','getComponents','GetTeams',
	function($scope, $stateParams, $location,$q, Authentication, PusManagements, getTeamNames, getComponents, GetTeams) {
		$scope.authentication = Authentication;

		var teamMembers = getTeamNames.query();
		$scope.creators = teamMembers;
		$scope.reviewers = getTeamNames.query();
		$scope.teams = GetTeams.query();
		$scope.currentCreator = '';
		$scope.currentReviewer = '';
		$scope.currentTeam = '';
		$scope.currentBranch = '';
		$scope.currentTestType = '';
		$scope.currentDisableToRun = false;

		$scope.serverTypes = ['Core', 'Console'];
		$scope.branches = ['LD96','LD97'];
		$scope.testTypes = ['PUS','Defect'];
		$scope.currentServerType = '';

		$scope.disableToRuns =[false,true];


		$scope.components = getComponents.query();
		//console.log($scope.components);
		$scope.currentComponent = '';



		// Create new Pus management
		$scope.create = function() {
			// Create new Pus management object
			var pusManagement = new PusManagements ({
				name: this.name,
				reviewer: this.currentReviewer,
				team: this.currentTeam,
				creator: this.currentCreator,
				component: this.currentComponent,
				serverType: this.currentServerType,
				SUTHost: this.SUTHost,
				branch: this.currentBranch,
				testType: this.currentTestType
				//disableToRun: this.currentDisableToRun

			});
				//console.log('component='+this.currentTeam);
			// Redirect after save
			pusManagement.$save(function(response) {
				$location.path('pus-managements/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.reviewer = '';
				$scope.team = '';
				$scope.creator = '';
				$scope.component = '';
				$scope.serverType = '';
				$scope.SUTHost = '';
				$scope.branch = '';
				$scope.testType = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Pus management
		$scope.remove = function(pusManagement) {
			if ( pusManagement ) {
				pusManagement.$remove();

				for (var i in $scope.pusManagements) {
					if ($scope.pusManagements [i] === pusManagement) {
						$scope.pusManagements.splice(i, 1);
					}
				}
			} else {
				$scope.pusManagement.$remove(function() {
					$location.path('pus-managements');
				});
			}
		};

		$scope.showTable = function() {
			function doQuery() {
				var d = $q.defer();
				var result = PusManagements.query(function() {
					d.resolve(result);
				});
				return d.promise;
			}
			$q.all(doQuery()).then(function(data) {
				var myObject = [];
				var i = 0;
				data.forEach(function(item){
					myObject[i] = item;
					i++;
				});
				$scope.rowCollection = myObject;
				$scope.displayedCollection = [].concat($scope.rowCollection);
			});
		};
		// Update existing Pus management
		$scope.update = function() {
			var pusManagement = $scope.pusManagement;
			//console.log(pusManagement);
			pusManagement.$update(function() {
				//console.log(pusManagement._id);
				$location.path('pus-managements/' + pusManagement._id);
				//console.log(pusManagement._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pus managements
		$scope.find = function() {
			$scope.pusManagements = PusManagements.query();
		};

		// Find existing Pus management
		$scope.findOne = function() {
			$scope.pusManagement = PusManagements.get({
				pusManagementId: $stateParams.pusManagementId
			});
			$scope.pusManagement.$promise.then(function(data){
				$scope.rowCollection = data.run_log;
				$scope.displayedCollection = [].concat($scope.rowCollection);
				$scope.getters={
					runDate:function(row){
						return new Date(row.runDate);
					}
				}
			});



		};
	}
]);
