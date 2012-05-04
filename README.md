rest-stress
===========
Stress tests against popular REST implimentations for NodeJS along with MongoDB inserts.

## Introduction
As part of an interview for a job I was asked to use some "real" scenarios for inspiration to write some sample code. One of the tests described persisting and accessing a Billion surveys from a REST service. Seeing as I was busy writing an Associative Database interface on top of MongoDB I decided that it would be nice to have a REST service too. 

## Setup
### Choosing a REST implimentation
My first instinct was to grab the project with the highest watch count on github namely [restify](http://mcavage.github.com/node-restify/). I thought that I would be happy with my choice and then quickly knock off my little project. But to my suprise the throughput was awful. I was witnessing 250 requests per second. What I gathered from prior research was that I should be close to 20 maybe even max out at 40 times that figure. 

I should say at this point that it was more than likely my test procedure that was faulty. I don't really remember exactly what I was doing and I really don't care that much to find out. Suffice to say that the code is in the project and I'm leaning very much to it being an issue with client (client-restify.js) and not the server. So I roled out my own fire and forget client so that I could focus purely on the server stress.     

### Candidates and baselines
After too much surfing, and probably because of what I read in a StackOverflow question, I decided to test two of the projects on github that have the most watchers. I