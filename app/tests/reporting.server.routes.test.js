'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Reporting = mongoose.model('Reporting'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, reporting;

/**
 * Reporting routes tests
 */
describe('Reporting CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Reporting
		user.save(function() {
			reporting = {
				name: 'Reporting Name'
			};

			done();
		});
	});

	it('should be able to save Reporting instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reporting
				agent.post('/reportings')
					.send(reporting)
					.expect(200)
					.end(function(reportingSaveErr, reportingSaveRes) {
						// Handle Reporting save error
						if (reportingSaveErr) done(reportingSaveErr);

						// Get a list of Reportings
						agent.get('/reportings')
							.end(function(reportingsGetErr, reportingsGetRes) {
								// Handle Reporting save error
								if (reportingsGetErr) done(reportingsGetErr);

								// Get Reportings list
								var reportings = reportingsGetRes.body;

								// Set assertions
								(reportings[0].user._id).should.equal(userId);
								(reportings[0].name).should.match('Reporting Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Reporting instance if not logged in', function(done) {
		agent.post('/reportings')
			.send(reporting)
			.expect(401)
			.end(function(reportingSaveErr, reportingSaveRes) {
				// Call the assertion callback
				done(reportingSaveErr);
			});
	});

	it('should not be able to save Reporting instance if no name is provided', function(done) {
		// Invalidate name field
		reporting.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reporting
				agent.post('/reportings')
					.send(reporting)
					.expect(400)
					.end(function(reportingSaveErr, reportingSaveRes) {
						// Set message assertion
						(reportingSaveRes.body.message).should.match('Please fill Reporting name');
						
						// Handle Reporting save error
						done(reportingSaveErr);
					});
			});
	});

	it('should be able to update Reporting instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reporting
				agent.post('/reportings')
					.send(reporting)
					.expect(200)
					.end(function(reportingSaveErr, reportingSaveRes) {
						// Handle Reporting save error
						if (reportingSaveErr) done(reportingSaveErr);

						// Update Reporting name
						reporting.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Reporting
						agent.put('/reportings/' + reportingSaveRes.body._id)
							.send(reporting)
							.expect(200)
							.end(function(reportingUpdateErr, reportingUpdateRes) {
								// Handle Reporting update error
								if (reportingUpdateErr) done(reportingUpdateErr);

								// Set assertions
								(reportingUpdateRes.body._id).should.equal(reportingSaveRes.body._id);
								(reportingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Reportings if not signed in', function(done) {
		// Create new Reporting model instance
		var reportingObj = new Reporting(reporting);

		// Save the Reporting
		reportingObj.save(function() {
			// Request Reportings
			request(app).get('/reportings')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Reporting if not signed in', function(done) {
		// Create new Reporting model instance
		var reportingObj = new Reporting(reporting);

		// Save the Reporting
		reportingObj.save(function() {
			request(app).get('/reportings/' + reportingObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', reporting.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Reporting instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reporting
				agent.post('/reportings')
					.send(reporting)
					.expect(200)
					.end(function(reportingSaveErr, reportingSaveRes) {
						// Handle Reporting save error
						if (reportingSaveErr) done(reportingSaveErr);

						// Delete existing Reporting
						agent.delete('/reportings/' + reportingSaveRes.body._id)
							.send(reporting)
							.expect(200)
							.end(function(reportingDeleteErr, reportingDeleteRes) {
								// Handle Reporting error error
								if (reportingDeleteErr) done(reportingDeleteErr);

								// Set assertions
								(reportingDeleteRes.body._id).should.equal(reportingSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Reporting instance if not signed in', function(done) {
		// Set Reporting user 
		reporting.user = user;

		// Create new Reporting model instance
		var reportingObj = new Reporting(reporting);

		// Save the Reporting
		reportingObj.save(function() {
			// Try deleting Reporting
			request(app).delete('/reportings/' + reportingObj._id)
			.expect(401)
			.end(function(reportingDeleteErr, reportingDeleteRes) {
				// Set message assertion
				(reportingDeleteRes.body.message).should.match('User is not logged in');

				// Handle Reporting error error
				done(reportingDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Reporting.remove().exec();
		done();
	});
});