'use strict';

(function() {
	// Pus managements Controller Spec
	describe('Pus managements Controller Tests', function() {
		// Initialize global variables
		var PusManagementsController,
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

			// Initialize the Pus managements controller.
			PusManagementsController = $controller('PusManagementsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Pus management object fetched from XHR', inject(function(PusManagements) {
			// Create sample Pus management using the Pus managements service
			var samplePusManagement = new PusManagements({
				name: 'New Pus management'
			});

			// Create a sample Pus managements array that includes the new Pus management
			var samplePusManagements = [samplePusManagement];

			// Set GET response
			$httpBackend.expectGET('pus-managements').respond(samplePusManagements);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pusManagements).toEqualData(samplePusManagements);
		}));

		it('$scope.findOne() should create an array with one Pus management object fetched from XHR using a pusManagementId URL parameter', inject(function(PusManagements) {
			// Define a sample Pus management object
			var samplePusManagement = new PusManagements({
				name: 'New Pus management'
			});

			// Set the URL parameter
			$stateParams.pusManagementId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/pus-managements\/([0-9a-fA-F]{24})$/).respond(samplePusManagement);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pusManagement).toEqualData(samplePusManagement);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PusManagements) {
			// Create a sample Pus management object
			var samplePusManagementPostData = new PusManagements({
				name: 'New Pus management'
			});

			// Create a sample Pus management response
			var samplePusManagementResponse = new PusManagements({
				_id: '525cf20451979dea2c000001',
				name: 'New Pus management'
			});

			// Fixture mock form input values
			scope.name = 'New Pus management';

			// Set POST response
			$httpBackend.expectPOST('pus-managements', samplePusManagementPostData).respond(samplePusManagementResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Pus management was created
			expect($location.path()).toBe('/pus-managements/' + samplePusManagementResponse._id);
		}));

		it('$scope.update() should update a valid Pus management', inject(function(PusManagements) {
			// Define a sample Pus management put data
			var samplePusManagementPutData = new PusManagements({
				_id: '525cf20451979dea2c000001',
				name: 'New Pus management'
			});

			// Mock Pus management in scope
			scope.pusManagement = samplePusManagementPutData;

			// Set PUT response
			$httpBackend.expectPUT(/pus-managements\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/pus-managements/' + samplePusManagementPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid pusManagementId and remove the Pus management from the scope', inject(function(PusManagements) {
			// Create new Pus management object
			var samplePusManagement = new PusManagements({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Pus managements array and include the Pus management
			scope.pusManagements = [samplePusManagement];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/pus-managements\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePusManagement);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.pusManagements.length).toBe(0);
		}));
	});
}());