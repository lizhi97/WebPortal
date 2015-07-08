'use strict';

(function() {
	// Ldmscomponents Controller Spec
	describe('Ldmscomponents Controller Tests', function() {
		// Initialize global variables
		var LdmscomponentsController,
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

			// Initialize the Ldmscomponents controller.
			LdmscomponentsController = $controller('LdmscomponentsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Ldmscomponent object fetched from XHR', inject(function(Ldmscomponents) {
			// Create sample Ldmscomponent using the Ldmscomponents service
			var sampleLdmscomponent = new Ldmscomponents({
				name: 'New Ldmscomponent'
			});

			// Create a sample Ldmscomponents array that includes the new Ldmscomponent
			var sampleLdmscomponents = [sampleLdmscomponent];

			// Set GET response
			$httpBackend.expectGET('ldmscomponents').respond(sampleLdmscomponents);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ldmscomponents).toEqualData(sampleLdmscomponents);
		}));

		it('$scope.findOne() should create an array with one Ldmscomponent object fetched from XHR using a ldmscomponentId URL parameter', inject(function(Ldmscomponents) {
			// Define a sample Ldmscomponent object
			var sampleLdmscomponent = new Ldmscomponents({
				name: 'New Ldmscomponent'
			});

			// Set the URL parameter
			$stateParams.ldmscomponentId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/ldmscomponents\/([0-9a-fA-F]{24})$/).respond(sampleLdmscomponent);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ldmscomponent).toEqualData(sampleLdmscomponent);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Ldmscomponents) {
			// Create a sample Ldmscomponent object
			var sampleLdmscomponentPostData = new Ldmscomponents({
				name: 'New Ldmscomponent'
			});

			// Create a sample Ldmscomponent response
			var sampleLdmscomponentResponse = new Ldmscomponents({
				_id: '525cf20451979dea2c000001',
				name: 'New Ldmscomponent'
			});

			// Fixture mock form input values
			scope.name = 'New Ldmscomponent';

			// Set POST response
			$httpBackend.expectPOST('ldmscomponents', sampleLdmscomponentPostData).respond(sampleLdmscomponentResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Ldmscomponent was created
			expect($location.path()).toBe('/ldmscomponents/' + sampleLdmscomponentResponse._id);
		}));

		it('$scope.update() should update a valid Ldmscomponent', inject(function(Ldmscomponents) {
			// Define a sample Ldmscomponent put data
			var sampleLdmscomponentPutData = new Ldmscomponents({
				_id: '525cf20451979dea2c000001',
				name: 'New Ldmscomponent'
			});

			// Mock Ldmscomponent in scope
			scope.ldmscomponent = sampleLdmscomponentPutData;

			// Set PUT response
			$httpBackend.expectPUT(/ldmscomponents\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/ldmscomponents/' + sampleLdmscomponentPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid ldmscomponentId and remove the Ldmscomponent from the scope', inject(function(Ldmscomponents) {
			// Create new Ldmscomponent object
			var sampleLdmscomponent = new Ldmscomponents({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Ldmscomponents array and include the Ldmscomponent
			scope.ldmscomponents = [sampleLdmscomponent];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/ldmscomponents\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLdmscomponent);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.ldmscomponents.length).toBe(0);
		}));
	});
}());