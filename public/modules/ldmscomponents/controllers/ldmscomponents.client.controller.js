'use strict';

// Ldmscomponents controller
angular.module('ldmscomponents').controller('LdmscomponentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ldmscomponents','GetTeams',
	function($scope, $stateParams, $location, Authentication, Ldmscomponents, GetTeams) {
		$scope.authentication = Authentication;


		var teams = GetTeams.query();
		$scope.teams = teams;
		$scope.currentTeam = 'Tiger';


		// Create new Ldmscomponent
		$scope.create = function() {

			// Create new Ldmscomponent object
			var ldmscomponent = new Ldmscomponents ({
				name: this.name,
				team: this.currentTeam,
				totalTests: this.totalTests
			});

			// Redirect after save
			ldmscomponent.$save(function(response) {
				$location.path('ldmscomponents/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.team = '';
				$scope.totalTests = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Ldmscomponent
		$scope.remove = function(ldmscomponent) {
			if ( ldmscomponent ) {
				ldmscomponent.$remove();

				for (var i in $scope.ldmscomponents) {
					if ($scope.ldmscomponents [i] === ldmscomponent) {
						$scope.ldmscomponents.splice(i, 1);
					}
				}
			} else {
				$scope.ldmscomponent.$remove(function() {
					$location.path('ldmscomponents');
				});
			}
		};

		// Update existing Ldmscomponent
		$scope.update = function() {
			var ldmscomponent = $scope.ldmscomponent;

			ldmscomponent.$update(function() {
				$location.path('ldmscomponents/' + ldmscomponent._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Ldmscomponents
		$scope.find = function() {

			$scope.ldmscomponents = Ldmscomponents.query();

		};

		// Find existing Ldmscomponent
		$scope.findOne = function() {
			$scope.ldmscomponent = Ldmscomponents.get({
				ldmscomponentId: $stateParams.ldmscomponentId
			});
		};
	}
]);
