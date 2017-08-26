var express = require('express');
var router = express.Router();

const swapi = require('swapi-node');
var paginate = require('express-paginate');
var app = express();

// keep this before all routes that will use pagination
app.use(paginate.middleware(10, 50));

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/character/:name', function(req, res, next) {
	var character=req.params.name;

	var search="http://swapi.co/api/people/?search="+character;
	swapi.get(search).then((result) => {
		if(result.count ==0){
			res.setHeader('Content-Type', 'text/plain');
			res.send("Character not found!");
		}
		else{
		res.render('character', { title: "Result for character name: " + character,data: result.results });
		}
	}).catch((err) => {
		res.render('error',{error:err});
	});

});

charactersArray=[];

function mysort(para) {
	if(para == "height"){
		   	charactersArray.sort(function(a,b){return (a.height-b.height);});
		}
		else if(para == "mass"){
		   	charactersArray.sort(function(a,b){return (a.mass -b.mass); });
		}
		if(para == "name"){
		   	charactersArray.sort(function(a,b){return a.name.localeCompare(b.name);});
		}
}

router.get('/characters', function(req, res, next) {
	if(charactersArray.length==0){
		swapi.get('http://swapi.co/api/people/').then((result) => {
		    charactersArray = charactersArray.concat(result.results);
		    return result.nextPage();
		}).then((result)=>{
		    charactersArray = charactersArray.concat(result.results);
		    return result.nextPage();
		}).then((result)=>{
		    charactersArray = charactersArray.concat(result.results);
		    return result.nextPage();
		}).then((result)=>{
		    charactersArray = charactersArray.concat(result.results);
		    return result.nextPage();
		}).then((result)=>{
		    charactersArray = charactersArray.concat(result.results);
		    charactersArray.filter(Boolean);
		    charactersArray.filter(function(val) { return val !== null; }).join(", ");
		    if(req.query.sort !="")
		    	mysort(req.query.sort);
		    res.render('characters', {data : charactersArray });
			// res.end();
		}).catch((err) => {
		    console.log(err);
		});
	}
	else{
		if(req.query.sort !=""){
		    mysort(req.query.sort);
			res.render('characters', {data : charactersArray });
			// res.end();
		}
	}
});

router.get('/planetresidents', function(req, res, next) {

	var planetName="";
	var planetResidents ={};
	var search="http://swapi.co/api/planets/1/";

	swapi.get(search).then((planet) => {
		planetName = planet.name;
		return planet.getResidents();
	}).then((residents) =>{
		var residentNames=[];
		for(r in residents){
			residentNames = residentNames.concat(residents[r].name);
		}
		// console.log(residentNames);
		planetResidents[planetName] = residentNames ;
		console.log(planetName);
		console.log(planetResidents);
		// if(result.count ==0){
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(planetResidents),null,3);
		// 	res.end()
		// }
		// else{
		// res.render('character', { title: "Result for character name: " + character,data: result.results });
		// }
	}).catch((err) => {
		res.render('error',{error:err});
	});

});




router.get('/pagetest', function(req, res, next) {

	Users=[];
	swapi.get('http://swapi.co/api/people/').then((result) => {
		    Users = Users.concat(result.results);
		    // return result.nextPage();
		}).catch((err)=>{
			console.log(err);
		});

  Users.paginate({}, { page: req.query.page, limit: req.query.limit }, function(err, users) {

    if (err) return next(err);

    res.format({
      // html: function() {
      //   res.render('_paginate', {
      //     users: users.name,
      //     pageCount: 10,
      //     itemCount: 10,
      //     pages: paginate.getArrayPages(req)(3, users.pages, req.query.page)
      //   });
      // },
      json: function() {
        // inspired by Stripe's API response for list objects
        res.json({
          object: 'list',
          has_more: paginate.hasNextPages(req)(users.pages),
          data: users.name
        });
      }
    });

  });

});





















module.exports = router; 