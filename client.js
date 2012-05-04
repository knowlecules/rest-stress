var http = require('http');
var helpers = require('./lib/helpers');

var port = 8004;
var appName = "StressClient";

var MAX_SURVEYS = 30000;
var collection ="surveybatched" ; // survey , surveybatched
helpers.dontUpdate=true;

var surveys = [
    {name:"Survey1", user: "User", answers:{"Q1":1,"Q2":2,"Q3":2,"Q4":2,"Q5":2,"Q6":2,"Q7":2,"Q8":2,"Q9":2,"Q10":2,"Q11":2,"Q12":2,"Q13":2,"Q14":2}},
    {name:"Survey2", user: "User", answers:{"Q1":1,"Q2":2,"Q3":2,"Q4":2,"Q5":2,"Q6":2,"Q7":2,"Q8":2}},
    {name:"Survey3", user: "User", answers:{"Q1":1,"Q2":2,"Q3":2,"Q4":2,"Q5":2,"Q6":2,"Q7":2,"Q8":2,"Q9":2,"Q10":2}}
]
var SURVEY_COUNT = surveys.length;

var options = {
    host: 'localhost',
    port: port,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }};

var start;
var isurv =0;
var idone=0;
if(!start){
    start = parseFloat(process.hrtime().join("."));
}

for(var ians=0; ians < MAX_SURVEYS; ians++){
    if(isurv == SURVEY_COUNT){
        isurv =0;
    }
    var survey =  surveys[isurv++];
    var user = survey.user + (parseInt(ians/3) +1);
    options.path = '/' +collection+ '/'+ survey.name + '/' + user;

    var req = http.request(options, function(res) {
        if(res.statusCode != 201){
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));

            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
            });
        }
        if(++idone == MAX_SURVEYS){
            helpers.logIntervals(parseFloat(process.hrtime().join(".")), start, idone);
            // Requires faith that it opens, but clients have a delayed start so np.
            helpers.db.open(function(err, db) {
                console.log( err ? "Could not open Mongo!" : "Mongo is open for business.");
                db.collection("Survey1").findOne({"user":"User1"}, console.log);
                return;
            });
        }
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(JSON.stringify(survey.answers));
    req.end();

    if(/00$/.test(user) && survey.name == "Survey1"){
        console.log("Added surveys for user " + user);
    }
}

console.log(appName + " interacting on port:" + port);