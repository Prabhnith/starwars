var express = require('express');
var router = express.Router();

const swapi = require('swapi-node');


/* GET home page. */
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



router.get('/test', function(req, res, next) {
		charactersArray=[];
		// swapi.get('http://swapi.co/api/people/').then((result) => {
		swapi.get('http://swapi.co/api/people/').then((result) => {
		charactersArray=[...result.results];
		    // console.log(result.count,result.results);
		    // charactersArray = charactersArray.concat(result.results);
		    res.render('characters', {data : charactersArray });
		    return result.nextPage();
		}).then((result)=>{
			console.log(result.count,result.results);
		    charactersArray = charactersArray.concat(result.results);
		    // res.render('characters', {data : charactersArray });
		//     return result.nextPage();
		// }).then((result)=>{
		// 	console.log(result.count,result.results);
		//     charactersArray = charactersArray.concat(result.results);
		//     return result.nextPage();
		// }).then((result)=>{
		// 	console.log(result.count,result.results);
		//     charactersArray = charactersArray.concat(result.results);
		//     return result.nextPage();
		// }).then((result)=>{
			// console.log(result.count,result.results);
		    // charactersArray = charactersArray.concat(result.results);
		    // charactersArray.filter(Boolean);
		    // charactersArray.filter(function(val) { return val !== null; }).join(", ");
		    // console.log("character are:",charactersArray.length,charactersArray); 

			// res.setHeader('Content-Type', 'application/json');
			// console.log((result.results));
			console.log(typeof(charactersArray));
			// res.render('characters', {data : charactersArray });
			// res.end();
		    // res.send(JSON.stringify(result.results, null, 3));

		}).catch((err) => {
		    console.log(err);
		});

			// charactersArray.length=50;


  // res.render('index', { title: 'mypage' });
});


router.get('/characters', function(req, res, next) {
	var charactersArray=[];
	swapi.get('http://swapi.co/api/people/').then((result) => {
	    // console.log(result.count,result.results);
	    charactersArray = charactersArray.concat(result.results);
	    // charactersArray.length=50;
	    charactersArray.filter(Boolean);
	    charactersArray.filter(function(val) { return val !== null; }).join(", ")

	    console.log("character are:",charactersArray.length,charactersArray); 
	    
		res.setHeader('Content-Type', 'application/json');
	    res.send(JSON.stringify({charactersArray}, null, 3));
	    // return result.nextPage();
	}).catch((err) => {
	    console.log(err);
	});

  // res.render('index', { title: 'mypage' });
});

module.exports = router;
