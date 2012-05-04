var helpers = require('../lib/helpers');
var journey = require('journey');

var port = 8002;
var appName = "NodeMongoStress";



// Requires faith that it opens, but clients have a delayed start so np.
helpers.db.open(function(err, db) {
    console.log( err ? "Could not open Mongo!" : "Mongo is open for business.");
    db.dropDatabase(function(err, result){
        console.log( err ? "Could not empty Mongo!" : "Mongo is empty.");
    });
});

// Create a Router object with an associated routing table
var router = new(journey.Router);

// Node's http server lib to attach the router to.
require('http').createServer(function (request, response) {
    var body = "";

    request.addListener('data', function (chunk) { body += chunk });
    request.addListener('end', function () {
        //
        // Dispatch the request to the router
        //
        router.handle(request, body, function (result) {
            response.writeHead(result.status, result.headers);
            response.end(result.body);
        });
    });
}).listen(port);

var now;
router.post(/^survey\/([^\/]*)\/([^\/]*)$/).bind(function surveyComplete(req, res,surveyName, user, params) {
    now = helpers.Upsert(helpers.db,surveyName,user,params, now, helpers.dontUpdate);
    res.send(201);
});

router.post(/^surveybatched\/([^\/]*)\/([^\/]*)$/).bind(function surveyComplete(req, res,surveyName, user, params) {
    now = helpers.UpsertBatch(helpers.db,surveyName,user,params, now, helpers.dontUpdate);
    res.send(201);
});

console.log(appName + " listening on port:" + port);