module.exports = function(router) {
	require('./users')(router);
	require('./devices')(router);
	require('./user')(router);
};