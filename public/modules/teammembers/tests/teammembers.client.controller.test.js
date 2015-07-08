'use strict';

(function() {
	// Teammembers Controller Spec
	describe('Teammembers Controller Tests', function() {
		// Initialize global variables
		var TeammembersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Teammembers controller.
			TeammembersController = $controller('TeammembersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Teammember object fetched from XHR', inject(function(Teammembers) {
			// Create sample Teammember using the Teammembers service
			var sampleTeammember = new Teammembers({
				name: 'New Teammember'
			});

			// Create a sample Teammembers array that includes the new Teammember
			var sampleTeammembers = [sampleTeammember];

			// Set GET response
			$httpBackend.expectGET('teammembers').respond(sampleTeammembers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.teammembers).toEqualData(sampleTeammembers);
		}));

		it('$scope.findOne() should create an array with one Teammember object fetched from XHR using a teammemberId URL parameter', inject(function(Teammembers) {
			// Define a sample Teammember object
			var sampleTeammember = new Teammembers({
				name: 'New Teammember'
			});

			// Set the URL parameter
			$stateParams.teammemberId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/teammembers\/([0-9a-fA-F]{24})$/).respond(sampleTeammember);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.teammember).toEqualData(sampleTeammember);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Teammembers) {
			// Create a sample Teammember object
			var sampleTeammemberPostData = new Teammembers({
				name: 'New Teammember'
			});

			// Create a sample Teammember response
			var sampleTeammemberResponse = new Teammembers({
				_id: '525cf20451979dea2c000001',
				name: 'New Teammember'
			});

			// Fixture mock form input values
			scope.name = 'New Teammember';

			// Set POST response
			$httpBackend.expectPOST('teammembers', sampleTeammemberPostData).respond(sampleTeammemberResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Teammember was created
			expect($location.path()).toBe('/teammembers/' + sampleTeammemberResponse._id);
		}));

		it('$scope.update() should update a valid Teammember', inject(function(Teammembers) {
			// Define a sample Teammember put data
			var sampleTeammemberPutData = new Teammembers({
				_id: '525cf20451979dea2c000001',
				name: 'New Teammember'
			});

			// Mock Teammember in scope
			scope.teammember = sampleTeammemberPutData;

			// Set PUT response
			$httpBackend.expectPUT(/teammembers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/teammembers/' + sampleTeammemberPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid teammemberId and remove the Teammember from the scope', inject(function(Teammembers) {
			// Create new Teammember object
			var sampleTeammember = new Teammembers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Teammembers array and include the Teammember
			scope.teammembers = [sampleTeammember];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/teammembers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTeammember);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.teammembers.length).toBe(0);
		}));
	});
}());