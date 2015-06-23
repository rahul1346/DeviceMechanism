var db = require('../db');
var devicesCollection = db.collection('devices');
var mongoskin = require('mongoskin');


exports.getUsers = function(deviceId, cb) {
	
	deviceId = db.toObjectID(deviceId);
	
	devicesCollection.findOne({_id: deviceId}, {users: 1}, function(err, device) {
			if(err) {
				console.log(err);
				return cb({error: 'Error in fetching users'});
			}
			if(!device) {
				return cb({error: 'DEVICE_NOT_FOUND'});
			}

			var users = device.users || [];
			cb(null, users);
	});
};

exports.addUser = function(deviceId, userId, cb) {
	
	deviceId = db.toObjectID(deviceId);
	userId = db.toObjectID(userId);
	
	devicesCollection.update({_id: deviceId}, {$addToSet: {users: userId}}, function(err) {
		console.log(arguments);
		if(err) {
			console.log(err);
			return cb({error: 'DB_ERROR'});
		}
		cb(null, {success: true});
	});
};

exports.isDeviceExists = function(deviceId, cb) {
	
	deviceId = db.toObjectID(deviceId);
	
	devicesCollection.findOne({_id: deviceId}, {_id: 1}, function(err, device) {
		if(err) {
			console.log(err);
			return cb({error: 'DB_ERROR'});
		}
		
		cb(null, !!device);
		
	});
	
};

exports.create = function(device, cb) {
	 
	if(!device || typeof device !== 'object') {
		return cb({error: 'INVALID_DEVICE_OBJECT'});
	}
	
	device.users = [];
	device._id = new mongoskin.ObjectID();
	
	devicesCollection.save(device, function(err, num, info) {

		console.log(info.upserted[0]);
		
		if(err) {
			console.log(err);
			return cb({error: 'DB_ERROR'});
		}
		if(!info.upserted.length) {
			return cb({error: 'NOT_ABLE_TO_SAVE_DEVICE'});
		}
		
		cb(null, info.upserted[0]._id);
		
	});
	
};