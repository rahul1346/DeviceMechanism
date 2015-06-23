var deviceService = require('../services').device;

module.exports = function(router) {
	
	router.route('/devices/:deviceId/users/').get(function(req, res) {
		
		var deviceId = req.params.deviceId;
		deviceService.getUsers(deviceId, function(err, users) {
			
			if(err) {
				console.log(err);
				return res.json(err);
			}
			res.json(users);
		});
	});
	
	router.route('/devices/add_user/:deviceId/:userId').get(function(req, res) {
		
		var deviceId = req.params.deviceId;
		var userId = req.params.userId;
		
		deviceService.addUser(deviceId, userId, function(err, resp) {
			if(err) {
				console.log(err);
				return res.json(err);
			}
			res.json(resp);
		});
	});
	
	router.route('/device/create').post(function(req, res) {
		
		var device = req.body;
		deviceService.create(device, function(err, resp) {
			
			if(err) {
				return res.json(err);
			}
			res.json({_id: resp});
		});
	});
};
