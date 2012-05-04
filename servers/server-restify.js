var restify = require('c:/dev/nodejs/node_modules/node-restify');
var helpers = require('../lib/helpers');

var appName = "NodeMongoStress";
var port = 8003;

// Requires faith that it opens, but clients have a delayed start so np.
helpers.db.open(function(err, db) {
    console.log( err ? "Could not open Mongo!" : "Mongo is open for business.");
    db.dropDatabase(function(err, result){
        console.log( err ? "Could not empty Mongo!" : "Mongo is empty.");
    });
});


var server = restify.createServer({
    name: appName
});

//Cannot read the json without this parser
server.use(restify.bodyParser());

var start,interval,now;
server.post('/survey/:survey_name/:user', function (req, res, next) {
    var surveyName = req.params.survey_name;
    var user = req.params.user;
    now = helpers.Upsert(helpers.db,surveyName,user, req.body, now, helpers.dontUpdate);
    res.writeHead(201, "", {'Content-Type': 'text/html'});
    res.end('');
});

server.post('/surveybatched/:survey_name/:user', function (req, res, next) {
    var surveyName = req.params.survey_name;
    var user = req.params.user;
    now = helpers.UpsertBatch(helpers.db,surveyName,user, req.body, now, helpers.dontUpdate);
    res.writeHead(201, "", {'Content-Type': 'text/html'});
    res.end('');
});


server.listen(port);
console.log(appName + " listening on port:" + port);