'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Ldmscomponent = mongoose.model('Ldmscomponent'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, ldmscomponent;

/**
 * Ldmscomponent routes tests
 */
describe('Ldmscomponent CRUD tests', function() {
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

		// Save a user to the test db and create new Ldmscomponent
		user.save(function() {
			ldmscomponent = {
				name: 'Ldmscomponent Name'
			};

			done();
		});
	});

	it('should be able to save Ldmscomponent instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ldmscomponent
				agent.post('/ldmscomponents')
					.send(ldmscomponent)
					.expect(200)
					.end(function(ldmscomponentSaveErr, ldmscomponentSaveRes) {
						// Handle Ldmscomponent save error
						if (ldmscomponentSaveErr) done(ldmscomponentSaveErr);

						// Get a list of Ldmscomponents
						agent.get('/ldmscomponents')
							.end(function(ldmscomponentsGetErr, ldmscomponentsGetRes) {
								// Handle Ldmscomponent save error
								if (ldmscomponentsGetErr) done(ldmscomponentsGetErr);

								// Get Ldmscomponents list
								var ldmscomponents = ldmscomponentsGetRes.body;

								// Set assertions
								(ldmscomponents[0].user._id).should.equal(userId);
								(ldmscomponents[0].name).should.match('Ldmscomponent Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Ldmscomponent instance if not logged in', function(done) {
		agent.post('/ldmscomponents')
			.send(ldmscomponent)
			.expect(401)
			.end(function(ldmscomponentSaveErr, ldmscomponentSaveRes) {
				// Call the assertion callback
				done(ldmscomponentSaveErr);
			});
	});

	it('should not be able to save Ldmscomponent instance if no name is provided', function(done) {
		// Invalidate name field
		ldmscomponent.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ldmscomponent
				agent.post('/ldmscomponents')
					.send(ldmscomponent)
					.expect(400)
					.end(function(ldmscomponentSaveErr, ldmscomponentSaveRes) {
						// Set message assertion
						(ldmscomponentSaveRes.body.message).should.match('Please fill Ldmscomponent name');
						
						// Handle Ldmscomponent save error
						done(ldmscomponentSaveErr);
					});
			});
	});

	it('should be able to update Ldmscomponent instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ldmscomponent
				agent.post('/ldmscomponents')
					.send(ldmscomponent)
					.expect(200)
					.end(function(ldmscomponentSaveErr, ldmscomponentSaveRes) {
						// Handle Ldmscomponent save error
						if (ldmscomponentSaveErr) done(ldmscomponentSaveErr);

						// Update Ldmscomponent name
						ldmscomponent.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Ldmscomponent
						agent.put('/ldmscomponents/' + ldmscomponentSaveRes.body._id)
							.send(ldmscomponent)
							.expect(200)
							.end(function(ldmscomponentUpdateErr, ldmscomponentUpdateRes) {
								// Handle Ldmscomponent update error
								if (ldmscomponentUpdateErr) done(ldmscomponentUpdateErr);

								// Set assertions
								(ldmscomponentUpdateRes.body._id).should.equal(ldmscomponentSaveRes.body._id);
								(ldmscomponentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Ldmscomponents if not signed in', function(done) {
		// Create new Ldmscomponent model instance
		var ldmscomponentObj = new Ldmscomponent(ldmscomponent);

		// Save the Ldmscomponent
		ldmscomponentObj.save(function() {
			// Request Ldmscomponents
			request(app).get('/ldmscomponents')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Ldmscomponent if not signed in', function(done) {
		// Create new Ldmscomponent model instance
		var ldmscomponentObj = new Ldmscomponent(ldmscomponent);

		// Save the Ldmscomponent
		ldmscomponentObj.save(function() {
			request(app).get('/ldmscomponents/' + ldmscomponentObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', ldmscomponent.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Ldmscomponent instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ldmscomponent
				agent.post('/ldmscomponents')
					.send(ldmscomponent)
					.expect(200)
					.end(function(ldmscomponentSaveErr, ldmscomponentSaveRes) {
						// Handle Ldmscomponent save error
						if (ldmscomponentSaveErr) done(ldmscomponentSaveErr);

						// Delete existing Ldmscomponent
						agent.delete('/ldmscomponents/' + ldmscomponentSaveRes.body._id)
							.send(ldmscomponent)
							.expect(200)
							.end(function(ldmscomponentDeleteErr, ldmscomponentDeleteRes) {
								// Handle Ldmscomponent error error
								if (ldmscomponentDeleteErr) done(ldmscomponentDeleteErr);

								// Set assertions
								(ldmscomponentDeleteRes.body._id).should.equal(ldmscomponentSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Ldmscomponent instance if not signed in', function(done) {
		// Set Ldmscomponent user 
		ldmscomponent.user = user;

		// Create new Ldmscomponent model instance
		var ldmscomponentObj = new Ldmscomponent(ldmscomponent);

		// Save the Ldmscomponent
		ldmscomponentObj.save(function() {
			// Try deleting Ldmscomponent
			request(app).delete('/ldmscomponents/' + ldmscomponentObj._id)
			.expect(401)
			.end(function(ldmscomponentDeleteErr, ldmscomponentDeleteRes) {
				// Set message assertion
				(ldmscomponentDeleteRes.body.message).should.match('User is not logged in');

				// Handle Ldmscomponent error error
				done(ldmscomponentDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Ldmscomponent.remove().exec();
		done();
	});
});