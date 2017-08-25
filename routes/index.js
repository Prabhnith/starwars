var express = require('express');
var router = express.Router();

const swapi = require('swapi-node');

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
		charactersArray=[...result.results];
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
			res.end();
		}).catch((err) => {
		    console.log(err);
		});
	}
	else{
		if(req.query.sort !=""){
		    mysort(req.query.sort);
			res.render('characters', {data : charactersArray });
			res.end();
		}
	}
});
module.exports = router;