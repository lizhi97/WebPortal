'use strict';

(function() {
	// Reportings Controller Spec
	describe('Reportings Controller Tests', function() {
		// Initialize global variables
		var ReportingsController,
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

			// Initialize the Reportings controller.
			ReportingsController = $controller('ReportingsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Reporting object fetched from XHR', inject(function(Reportings) {
			// Create sample Reporting using the Reportings service
			var sampleReporting = new Reportings({
				name: 'New Reporting'
			});

			// Create a sample Reportings array that includes the new Reporting
			var sampleReportings = [sampleReporting];

			// Set GET response
			$httpBackend.expectGET('reportings').respond(sampleReportings);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.reportings).toEqualData(sampleReportings);
		}));

		it('$scope.findOne() should create an array with one Reporting object fetched from XHR using a reportingId URL parameter', inject(function(Reportings) {
			// Define a sample Reporting object
			var sampleReporting = new Reportings({
				name: 'New Reporting'
			});

			// Set the URL parameter
			$stateParams.reportingId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/reportings\/([0-9a-fA-F]{24})$/).respond(sampleReporting);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.reporting).toEqualData(sampleReporting);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Reportings) {
			// Create a sample Reporting object
			var sampleReportingPostData = new Reportings({
				name: 'New Reporting'
			});

			// Create a sample Reporting response
			var sampleReportingResponse = new Reportings({
				_id: '525cf20451979dea2c000001',
				name: 'New Reporting'
			});

			// Fixture mock form input values
			scope.name = 'New Reporting';

			// Set POST response
			$httpBackend.expectPOST('reportings', sampleReportingPostData).respond(sampleReportingResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Reporting was created
			expect($location.path()).toBe('/reportings/' + sampleReportingResponse._id);
		}));

		it('$scope.update() should update a valid Reporting', inject(function(Reportings) {
			// Define a sample Reporting put data
			var sampleReportingPutData = new Reportings({
				_id: '525cf20451979dea2c000001',
				name: 'New Reporting'
			});

			// Mock Reporting in scope
			scope.reporting = sampleReportingPutData;

			// Set PUT response
			$httpBackend.expectPUT(/reportings\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/reportings/' + sampleReportingPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid reportingId and remove the Reporting from the scope', inject(function(Reportings) {
			// Create new Reporting object
			var sampleReporting = new Reportings({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Reportings array and include the Reporting
			scope.reportings = [sampleReporting];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/reportings\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleReporting);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.reportings.length).toBe(0);
		}));
	});
}());