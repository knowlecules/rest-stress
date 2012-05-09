var helpers = require('../lib/helpers');
var routes = require('../lib/node-rest')();

var appName = "NodeMongoStress";
var port = 8005;

// Requires faith that it opens, but clients have a delayed start so np.
helpers.db.open(function(err, db) {
    console.log( err ? "Could not open Mongo!" : "Mongo is open for business.");
    db.dropDatabase(function(err, result){
        console.log( err ? "Could not empty Mongo!" : "Mongo is empty.");
    });
});

//...Love this syntax.
routes('/survey/:survey_name/:user')
    ('post', function(req, res, params, jsonData){
        surveyComplete(req, res, params.survey_name, params.user, jsonData);
    });
routes('/surveybatched/:survey_name/:user')
    ('post', function(req, res, params, jsonData){
        surveyBatchComplete(req, res, params.survey_name, params.user, jsonData);
    });
routes.listen(port);

var interval;
function surveyComplete(req, res, surveyName, user, params) {
    interval = helpers.Upsert(helpers.db,surveyName,user,params, interval, helpers.dontUpdate);
    res.writeHead(201, "", {'Content-Type': 'text/html'});
    res.end('');
};

function surveyBatchComplete(req, res, surveyName, user, params) {
    interval = helpers.UpsertBatch(helpers.db,surveyName,user,params, interval, helpers.dontUpdate);
    res.writeHead(201, "", {'Content-Type': 'text/html'});
    res.end('');
};
console.log(appName + " listening on port:" + port);