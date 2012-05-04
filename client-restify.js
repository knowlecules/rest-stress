var restify = require('node-restify');
var assert = require("assert");

var port = 8003;
var appName = "StressClient";
var MAX_SURVEYS = 9000;
var SURVEY_COUNT = 3;

var surveys = [
    {name:"Survey1", user: "User", answers:{"Q1":1,"Q2":2,"Q3":2,"Q4":2,"Q5":2,"Q6":2,"Q7":2,"Q8":2,"Q9":2,"Q10":2,"Q11":2,"Q12":2,"Q13":2,"Q14":2}},
    {name:"Survey2", user: "User", answers:{"Q1":1,"Q2":2,"Q3":2,"Q4":2,"Q5":2,"Q6":2,"Q7":2,"Q8":2}},
    {name:"Survey3", user: "User", answers:{"Q1":1,"Q2":2,"Q3":2,"Q4":2,"Q5":2,"Q6":2,"Q7":2,"Q8":2,"Q9":2,"Q10":2}}
]

var client = restify.createJsonClient({
    url: 'http://localhost:' + port,
    version: '*'
});

var isurv =0;
for(var ians=0; ians < MAX_SURVEYS; ians++){
    if(isurv == SURVEY_COUNT){
        isurv =0;
    }
    var survey =  surveys[isurv++];
    var user = survey.user + (parseInt(ians/3) +1);
    client.post('/survey/'+ survey.name + '/' + user, survey.answers, function(err, req, res, obj) {
        if(err){
            console.log("Error while sending survey result " + err);
        };
        //console.log('%d -> %j', res.statusCode, res.headers);
        //console.log('%j', obj);
        if(/00$/.test(user) && survey.name == "Survey1"){
            console.log("Added surveys for user " + user);
        }
    });
}

console.log(appName + " interacting on port:" + port);