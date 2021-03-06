var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 3000;
var router = express.Router();

router.get('/', function(req, res) {
	res.end(require('fs').readFileSync(__dirname + '/static/route-details.txt'));
});

app.use('/', router);

require('./routes')(router);

app.listen(port);
console.log('Listening on port ' + port);
