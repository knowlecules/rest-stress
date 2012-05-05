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

## It's over
For all the work and the limited performance improvements I think that 