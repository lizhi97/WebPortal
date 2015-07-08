'use strict';

// Teammembers controller
angular.module('teammembers').controller('TeammembersController', ['$scope', '$stateParams', '$location', 'Authentication','Teammembers','GetTeams',
	function($scope, $stateParams, $location, Authentication, Teammembers, GetTeams) {
		$scope.authentication = Authentication;


		var teams = GetTeams.query();
		$scope.teams = teams;
		//console.log(teams);
		$scope.currentTeam = 'Tiger';



		// Create new Teammember
		$scope.create = function() {
			// Create new Teammember object
			var teammember = new Teammembers ({
				name: this.name,
				team: this.currentTeam,
				email: this.email
			});
			//console.log(this.currentTeam.team);

			// Redirect after save
			teammember.$save(function(response) {
				$location.path('teammembers/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.email = '';
				$scope.team='';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Teammember
		$scope.remove = function(teammember) {
			if ( teammember ) {
				teammember.$remove();

				for (var i in $scope.teammembers) {
					if ($scope.teammembers [i] === teammember) {
						$scope.teammembers.splice(i, 1);
					}
				}
			} else {
				$scope.teammember.$remove(function() {
					$location.path('teammembers');
				});
			}
		};

		// Update existing Teammember
		$scope.update = function() {
			var teammember = $scope.teammember;

			teammember.$update(function() {
				$location.path('teammembers/' + teammember._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Teammembers
		$scope.find = function() {
			$scope.teammembers = Teammembers.query();
		};

		// Find existing Teammember
		$scope.findOne = function() {
			$scope.teammember = Teammembers.get({
				teammemberId: $stateParams.teammemberId
			});
			//$scope.currentTeam = $scope.teammember.team;
			//console.log($scope.teammember );
		};
	}
]);
