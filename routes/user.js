var userService = require('../services').user;

module.exports = function(router) {
	
	router.route('/user/share/:userId/:deviceId').get(function(req, res) {
		
		var sessionUserId = req.user && req.user._id ? req.user._id.toString() : '55897a624e35030710813933'; 
		var targetUserId = req.params.userId;
		var deviceId = req.params.deviceId;
		
		userService.shareDevice(sessionUserId, targetUserId, deviceId, function(err, resp) {
			if(err) {
				console.log(err);
				return res.json(err);
			}
			res.json(resp);
		});
	});
	
	router.route('/user/create').post(function(req, res) {
		
		var user = req.body;
		console.log('user', user);
		
		userService.create(user, function(err, resp) {
			if(err) {
				return res.json(err);
			}
			res.json({_id: resp});
		});
	});
};
