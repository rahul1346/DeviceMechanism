var db = require('../db');
var usersCollection = db.collection('users');
var deviceService = require('./device');
var async = require('async');
var mongoskin = require('mongoskin');

console.log(db.toObjectID, 'usersCollection');

exports.getDevices = function(userId, cb) {
	
	userId = db.toObjectID(userId);
	console.log('userId', userId, userId instanceof String);
	
	usersCollection.findOne({_id: userId}, function(err, user) {
			if(err) {
				console.log(err);
				return cb({error: 'Error in fetching users'});
			}
			
			console.log('user', user);
			
			if(!user) {
				return cb({error: 'USER_NOT_FOUND'});
			}
			
			var devices = user.devices || [];
			
			cb(null, devices);
	});
};

exports.shareDevice = function(userId, toUserId, deviceId, cb) {
	
	// userId = db.toObjectID(userId);
	// toUserId = db.toObjectID(toUserId);
	// deviceId = db.toObjectID(deviceId);
	
	async.series([
		function(asyncCb) {
			exports.isUserExists(toUserId, function(err, exists) {
				if(err) {
					return asyncCb(err);
				}
				if(!exists) {
					return asyncCb({error: 'USER_NOT_FOUND'});
				}
				asyncCb();	
			});
		}, 
		
		function(asyncCb) {
			
			deviceService.isDeviceExists(deviceId, function(err, exists) {
				if(err) {
					return asyncCb(err);
				}
				if(!exists) {
					return asyncCb({error: 'DEVICE_NOT_FOUND'});
				}
				
				asyncCb();
			});
		},
		
		function(asyncCb) {
			
			exports.isDeviceExists(userId, deviceId, function(err, exists) {
				
				if(err) {
					return asyncCb(err);
				}
				if(!exists) {
					return asyncCb({error: 'DEVICE_NOT_FOUND_IN_USER'});
				}
				asyncCb();
			});
		},
		
		function(asyncCb) {
			
			exports.addDevice(toUserId, deviceId, function(err) {
				if(err) {
					return asyncCb({error: 'NOT_ABLE_TO_ADD_DEVICE_TO_USER'})
				}
				asyncCb();
			});
		},
		
		function(asyncCb) {
			
			deviceService.addUser(deviceId, toUserId, function(err) {
				if(err) {
					return asyncCb({error: 'NOT_ABLE_TO_ADD_USER_TO_DEVICE'});
				}
				asyncCb();
			});
		}
		
	], function(err) {
		
		if(err) {
			if(err.error === 'NOT_ABLE_TO_ADD_USER_TO_DEVICE') {
				exports.removeDevice(toUserId, deviceId, function(err) {
					if(err) {
						return cb({error: 'SYSTEM_IS_NOT_STABLE'});
					}
					cb(err);
				});
				return;		
			}
			
			console.log('err', err);
			return cb(err);
		}
		cb(null, {success: true});
	});
	
};

exports.isUserExists = function(userId, cb) {
	
	userId = db.toObjectID(userId);
	
	usersCollection.findOne({_id: userId}, {_id: 1}, function(err, user) {
		
		if(err) {
			console.log(err);
			return cb({error: 'DB_ERROR'});
		}
		cb(null, !!user);
	});
};

exports.isDeviceExists = function(userId, deviceId, cb) {
	
	userId = db.toObjectID(userId);
	deviceId = db.toObjectID(deviceId);
	
	usersCollection.findOne({_id: userId, devices: deviceId}, {_id: 1}, function(err, user) {
		if(err) {
			console.log(err);
			return cb({error: 'DB_ERROR'});
		}
		cb(null, !!user);
	});
};

exports.addDevice = function(userId, deviceId, cb) {
	
	userId = db.toObjectID(userId);
	deviceId = db.toObjectID(deviceId);
	
	usersCollection.update({_id: userId}, {$addToSet: {devices: deviceId}}, function(err) {
		console.log(arguments);
		if(err) {
			console.log(err);
			return cb({error: 'DB_ERROR'});
		}
		cb(null, {success: true});
	});
	
};

exports.removeDevice = function(userId, deviceId, cb) {
	
	userId = db.toObjectID(userId);
	deviceId = db.toObjectID(deviceId);
	
	usersCollection.update({_id: userId}, {$pull: {devices: deviceId}}, function(err) {
		console.log(arguments);
		if(err) {
			console.log(err);
			return cb({error: 'DB_ERROR'});
		}
		cb(null, {success: true});
	});
};


exports.create = function(user, cb) {
	 
	if(!user || typeof user !== 'object') {
		return cb({error: 'INVALID_USER_OBJECT'});
	}
	
	user.devices = [];
	user._id = new mongoskin.ObjectID();
	
	usersCollection.save(user, function(err, num, info) {
		console.log(info.upserted[0]);
		if(err) {
			console.log(err);
			return cb({error: 'DB_ERROR'});
		}
		if(!info.upserted.length) {
			return cb({error: 'NOT_ABLE_TO_SAVE_USER'});
		}
		cb(null, info.upserted[0]._id);
	});
};
