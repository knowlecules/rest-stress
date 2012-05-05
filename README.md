rest-stress
===========
Stress tests against popular REST implimentations for NodeJS along with MongoDB inserts.

## Introduction
As part of an interview for a job I was asked to use some "real" scenarios for inspiration to write some sample code. One of the tests described persisting and accessing a Billion surveys from a REST service. Seeing as I was busy writing an Associative Database interface on top of MongoDB I decided that it would be nice to have a REST service too, effectively killing both those birds. 

installation
------------

Sorry, but this was just a POC and I'm not ready to venture into packaging just yet, so git this project and then npm journery and restify. That should do it.


## Defining the scope of the trial
### Choosing a REST implimentation
My first instinct was to grab the project with the highest watch count on github namely [restify](http://mcavage.github.com/node-restify/). I thought that I would be happy with my choice and then quickly knock off the little project. But to my suprise the throughput was awful. I was witnessing 250 requests per second. What I gathered from prior research was that I should be close to 10, 20 times maxing out at 40 times that figure. 

I should say at this point that it was more than likely my test procedure that was faulty. I don't really remember exactly what I was doing and I really don't care that much to find out. Life goes on. I left the remnants of the code in the project and I'm leaning very much to it being an issue with client (client-restify.js) and not the server. So I roled out my own fire-and-forget client so that I could focus purely on the server trials.     

### Candidates and the baseline
After too much surfing, and probably because of what I read in a StackOverflow question, I decided to add [journey](https://github.com/cloudhead/journey) to the trial. If you're doing a trial of your own, you will need a baseline to measure against and then, of course, you should be inspired to write your own library that runs somewhere between the baseline and the fastest contender. 

Having done these kinds of things before I know that there are people out there that have made inroads on projects and left them stagnant and once in a while you'll find some code that's far enough along that you can use it for your own nefarious gains. For this project, that would be [node-rest](https://github.com/tmpvar/node-rest), it was broken(I think, maybe I was using it incorrectly) but far enough along and with a pretty enough syntax that I decided to use this as a starting point for my own KISS REST server.

### The line-up
In no particular order here is a short description of the libaries

- [restify](http://mcavage.github.com/node-restify/).  
 - This author is rather prolific in the NodeJS arena and 500 users are watching the project
- [journey](https://github.com/cloudhead/journey)
  - The author of LESS, and with 274 users watching the project.
- baseline
  - Close to the best possible throughput that you could expect from a REST server running on top of NodeJS 
- rapid-rest(based on [node-rest](https://github.com/tmpvar/node-rest))
  - Minimum implimentation of a REST server that accepts parameterized urls and knows JSON from whatever else it receives.

### Metrics to measure
The original intention was to measure time and consumption. After testing a few benchmarking libraries it became apparent that the test suites were consuming most of the resources. I was getting some pretty graphs but at what cost? 

Just as important as designing and writing the code is ensuring that the testing harness does not affect the test results. Initial tests were run using a client written using the library provided by restify (client-restify.js). 

This client was rewritten (client.js) using plain NodeJS libraries and the impact was 30% time improvement.  The client is “fire and forget” requester and therefore it has a cap to the number of requests it can make before saturating the resources. For these test on the test machine the cap is 300,000 but you'll find performance takes a hit around 90,000.  

## Testing
The requirements are to measure the rate at which a database can be populated with JSON strings that represent a user’s answers to a questionnaire a la survey. To isolate the impact of the database on the performance another set of tests will be run without any data access.

### Rate of REST requests
A measure of how well the different implimentations handle 30,000 requests

![Rate of REST ](https://github.com/knowlecules/rest-stress/raw/master/images/restRate.png)

### Rate of REST requests with MongoDB inserts
A measure of how well the different implimentations handle 30,000 requests and subsequent mongoDB insertions

![Rate of REST with Mongo insert ](https://github.com/knowlecules/rest-stress/raw/master/images/restMongoRate.png)

### REST request processing above the baseline
A measure of the excess processing required to respond to a REST request.

![REST request overhead](https://github.com/knowlecules/rest-stress/raw/master/images/restOverhead.png)

### REST and MongoDB request processing above the baseline
A measure of the excess processing required to respond to a REST request that inserts a single document into a MongoDB database.
 
![REST with Mongo insert overhead](https://github.com/knowlecules/rest-stress/raw/master/images/restMongoOverhead.png)

## It's over. Now what?
### What's the lesson?
####Generate concise functions in advance
  - I did not dissect any of the code behind restify or journey, but I know that the performance difference has everything to do with the number of lines running when a request is made. In the case of a REST server we have a great advantage in the fact that the server is configured in advance. It's here that the function that will run should be generated to have the minimum number of lines to be able to respond to the request. 
####Batch mongo inserts
  - A spin off result of this benchmark was figuring out how to improve mongo throughput by sending arrays of objects. If you bother running the benchmarks and do the calculations you'll find a 300% improvement for rapid-rest and 200% for journey and restify above the baseline results. The optimum batch size appears to be more than 4 but less than 15 which is great if you're developing with a cache.


### Which is the better server?
That all depends on what you're looking for. If you need a full featured REST server that has a proven track record and numerous contributors that have probably squashed most of the bugs then you'll probably want to choose either restify or journey. If you're a programmer looking to eek out a few mips to impress the boss and you have a simple requirement then rapid-rest might get you noticed.

Personally, I think I'll write a wrapper so that I can switch out rapid-rest for restify. Just in case ;-)
