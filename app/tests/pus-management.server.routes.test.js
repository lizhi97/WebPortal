'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PusManagement = mongoose.model('PusManagement'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, pusManagement;

/**
 * Pus management routes tests
 */
describe('Pus management CRUD tests', function() {
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

		// Save a user to the test db and create new Pus management
		user.save(function() {
			pusManagement = {
				name: 'Pus management Name'
			};

			done();
		});
	});

	it('should be able to save Pus management instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pus management
				agent.post('/pus-managements')
					.send(pusManagement)
					.expect(200)
					.end(function(pusManagementSaveErr, pusManagementSaveRes) {
						// Handle Pus management save error
						if (pusManagementSaveErr) done(pusManagementSaveErr);

						// Get a list of Pus managements
						agent.get('/pus-managements')
							.end(function(pusManagementsGetErr, pusManagementsGetRes) {
								// Handle Pus management save error
								if (pusManagementsGetErr) done(pusManagementsGetErr);

								// Get Pus managements list
								var pusManagements = pusManagementsGetRes.body;

								// Set assertions
								(pusManagements[0].user._id).should.equal(userId);
								(pusManagements[0].name).should.match('Pus management Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Pus management instance if not logged in', function(done) {
		agent.post('/pus-managements')
			.send(pusManagement)
			.expect(401)
			.end(function(pusManagementSaveErr, pusManagementSaveRes) {
				// Call the assertion callback
				done(pusManagementSaveErr);
			});
	});

	it('should not be able to save Pus management instance if no name is provided', function(done) {
		// Invalidate name field
		pusManagement.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pus management
				agent.post('/pus-managements')
					.send(pusManagement)
					.expect(400)
					.end(function(pusManagementSaveErr, pusManagementSaveRes) {
						// Set message assertion
						(pusManagementSaveRes.body.message).should.match('Please fill Pus management name');
						
						// Handle Pus management save error
						done(pusManagementSaveErr);
					});
			});
	});

	it('should be able to update Pus management instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pus management
				agent.post('/pus-managements')
					.send(pusManagement)
					.expect(200)
					.end(function(pusManagementSaveErr, pusManagementSaveRes) {
						// Handle Pus management save error
						if (pusManagementSaveErr) done(pusManagementSaveErr);

						// Update Pus management name
						pusManagement.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Pus management
						agent.put('/pus-managements/' + pusManagementSaveRes.body._id)
							.send(pusManagement)
							.expect(200)
							.end(function(pusManagementUpdateErr, pusManagementUpdateRes) {
								// Handle Pus management update error
								if (pusManagementUpdateErr) done(pusManagementUpdateErr);

								// Set assertions
								(pusManagementUpdateRes.body._id).should.equal(pusManagementSaveRes.body._id);
								(pusManagementUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Pus managements if not signed in', function(done) {
		// Create new Pus management model instance
		var pusManagementObj = new PusManagement(pusManagement);

		// Save the Pus management
		pusManagementObj.save(function() {
			// Request Pus managements
			request(app).get('/pus-managements')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Pus management if not signed in', function(done) {
		// Create new Pus management model instance
		var pusManagementObj = new PusManagement(pusManagement);

		// Save the Pus management
		pusManagementObj.save(function() {
			request(app).get('/pus-managements/' + pusManagementObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', pusManagement.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Pus management instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pus management
				agent.post('/pus-managements')
					.send(pusManagement)
					.expect(200)
					.end(function(pusManagementSaveErr, pusManagementSaveRes) {
						// Handle Pus management save error
						if (pusManagementSaveErr) done(pusManagementSaveErr);

						// Delete existing Pus management
						agent.delete('/pus-managements/' + pusManagementSaveRes.body._id)
							.send(pusManagement)
							.expect(200)
							.end(function(pusManagementDeleteErr, pusManagementDeleteRes) {
								// Handle Pus management error error
								if (pusManagementDeleteErr) done(pusManagementDeleteErr);

								// Set assertions
								(pusManagementDeleteRes.body._id).should.equal(pusManagementSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Pus management instance if not signed in', function(done) {
		// Set Pus management user 
		pusManagement.user = user;

		// Create new Pus management model instance
		var pusManagementObj = new PusManagement(pusManagement);

		// Save the Pus management
		pusManagementObj.save(function() {
			// Try deleting Pus management
			request(app).delete('/pus-managements/' + pusManagementObj._id)
			.expect(401)
			.end(function(pusManagementDeleteErr, pusManagementDeleteRes) {
				// Set message assertion
				(pusManagementDeleteRes.body.message).should.match('User is not logged in');

				// Handle Pus management error error
				done(pusManagementDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PusManagement.remove().exec();
		done();
	});
});