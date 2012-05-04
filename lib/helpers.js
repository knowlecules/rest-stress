exports.dontUpdate = false;
var batchSize = 10;
var mongo = require('mongodb');
var Db = mongo.Db,
    Connection = mongo.Connection,
    DbServer = mongo.Server;

var databaseName = "NodeMongoStress";

//Boiler plate mongo connection
var dbHost = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var dbPort = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;
console.log("Connecting to " + dbHost + ":" + dbPort + ", database:" + databaseName);
exports.db = new Db(databaseName, new DbServer(dbHost, dbPort, {}), {auto_reconnect: true});
// Requires faith that it opens, but clients have a delayed start so np.

function LogIntervals(lastLogTime, start, iteration){
    var interval = parseFloat(process.hrtime().join(".")) - lastLogTime;
    var intervalMatch = (interval+"").match(/(\d+\.\d{0,3})/) ;
    var intervalFmt = intervalMatch == null ? "0" :  intervalMatch[1];
    var nowTime = parseFloat(process.hrtime().join("."));
    var dateDiffMatch = ((nowTime - start)+"").match(/^(\d*\.\d{0,3})/);
    var dateDiffFmt = dateDiffMatch == null ? "0" :  dateDiffMatch[1];
    console.log("Added survey number " + iteration  + "(x3) after " + dateDiffFmt  + "s interval " + intervalFmt + "s." );
    return nowTime;
}
exports.logIntervals = LogIntervals;

function HandleIntervals(lastLogTime, start, iteration){
    if(err){
    console.log(err);
    }

    if(/000$/.test(user) && surveyName == "Survey1"){
        now = LogIntervals(now, start, user.match(/(\d+)$/)[1]);
        return now;
    }
}
var start
exports.Upsert = function(db, surveyName, user, params, now, dontUpdate){
    if(!start){
        start = parseFloat(process.hrtime().join("."));
        now = start;
    }

    if(dontUpdate){

        if(/000$/.test(user) && surveyName == "Survey1"){
            now = LogIntervals(now, start, user.match(/(\d+)$/)[1]);
            return now;
        }
        return;
    }

    //db.collection(surveyName).update({user:user}, {$set:{"answers":params}}, {safe:false, upsert:true}, function(err,doc){

    db.collection(surveyName).insert({user:user,"answers":params}, {safe:false}, function(err){
        if(err){
           console.log(err);
        }

        if(/000$/.test(user) && surveyName == "Survey1"){
            now = LogIntervals(now, start, user.match(/(\d+)$/)[1]);
            return now;
        }
    });
    return now;
}

var  batches = {};
exports.UpsertBatch = function(db, surveyName, user, params, now, dontUpdate){
    if(!start){
        start = parseFloat(process.hrtime().join("."));
        now = start;
    }

    if(dontUpdate){

        if(/000$/.test(user) && surveyName == "Survey1"){
            now = LogIntervals(now, start, user.match(/(\d+)$/)[1]);
            return now;
        }
        return;
    }

    if(!batches[surveyName]){
        batches[surveyName] = [];
    }

    batches[surveyName].push({user:user,"answers":params});
    // Naive batching, but sufficient for benchmarking.
    if(batches[surveyName].length == batchSize){
        // Array is automatically converted to individual documents. ie Batching does not affect search algorithm
        db.collection(surveyName).insert(batches[surveyName], {safe:false}, function(err){
            if(err){
                console.log(err);
            }

            if(/000$/.test(user) && surveyName == "Survey1"){
                now = LogIntervals(now, start, user.match(/(\d+)$/)[1]);
                return now;
            }
        });
        batches[surveyName] = [];
    }
    return now;
}