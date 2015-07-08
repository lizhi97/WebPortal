'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Ldmscomponent = mongoose.model('Ldmscomponent');

/**
 * Globals
 */
var user, ldmscomponent;

/**
 * Unit tests
 */
describe('Ldmscomponent Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			ldmscomponent = new Ldmscomponent({
				name: 'Ldmscomponent Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return ldmscomponent.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			ldmscomponent.name = '';

			return ldmscomponent.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Ldmscomponent.remove().exec();
		User.remove().exec();

		done();
	});
});