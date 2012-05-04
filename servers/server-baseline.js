var helpers = require('../lib/helpers');
var http = require('http');

var port = 8001;
var appName = "NodeMongoStress";

// Requires faith that it opens, but clients have a delayed start so np.
helpers.db.open(function(err, db) {
    console.log( err ? "Could not open Mongo!" : "Mongo is open for business.");
    db.dropDatabase(function(err, result){
        console.log( err ? "Could not empty Mongo!" : "Mongo is empty.");
    });
});

http.createServer(function (req, res) {
    var urlParts = req.url.substr(1).split("/");
 //set up some routes
   rest[req.method](req, res, urlParts);
}).listen(port);

var rest  = {
    POST : function(req, res, urlParts){
    switch(urlParts[0]) {
        case 'survey':
            surveyComplete(req, res,urlParts[1], urlParts[2]);
            break;
        case 'surveybatched':
            surveyBatchComplete(req, res,urlParts[1], urlParts[2]);
            break;
        default:
            res.writeHead(404, "Not found", {'Content-Type': 'text/html'});
            res.end('<html><head><title>404 - Not found</title></head><body><h1>Not found.</h1></body></html>');
            console.log("[404] " + req.method + " to " + req.url + " parts[" + urlParts.join('>')+ "]");
    };
}

}

var interval;
function surveyComplete(req, res, surveyName, user, params, next) {
    interval = helpers.Upsert(helpers.db,surveyName,user,params, interval, helpers.dontUpdate);
    res.writeHead(201, "", {'Content-Type': 'text/html'});
    res.end('');
};

function surveyBatchComplete(req, res, surveyName, user, params, next) {
    interval = helpers.UpsertBatch(helpers.db,surveyName,user,params, interval, helpers.dontUpdate);
    res.writeHead(201, "", {'Content-Type': 'text/html'});
    res.end('');
};
console.log(appName + " listening on port:" + port);