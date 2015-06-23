var userService = require('../services').user;

module.exports = function(router) {
	
	router.route('/users/:userId/devices/').get(function(req, res) {
		
		var userId = req.params.userId;
		
		userService.getDevices(userId, function(err, devices) {
			if(err) {
				console.log(err);
				return res.json(err);
			}
			res.json(devices);
		});
	});
	
	router.route('/users/add_device/:userId/:deviceId').get(function(req, res) {
		
		var userId = req.params.userId;
		var deviceId = req.params.deviceId;
		
		userService.addDevice(userId, deviceId, function(err, resp) {
			if(err) {
				console.log(err);
				return res.json(err);
			}
			res.json(resp);
		});
	});
};
