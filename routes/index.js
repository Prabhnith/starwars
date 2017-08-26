var express = require('express');
var router = express.Router();
var async = require('async');

const swapi = require('swapi-node');

pageNumber = 1;
currentArray = []
charactersArray = [];

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Star Wars' });
});

router.get('/character/:name', function(req, res, next) {
    var character = req.params.name;

    var search = "http://swapi.co/api/people/?search=" + character;
    swapi.get(search).then((result) => {
        if (result.count == 0) {
            res.setHeader('Content-Type', 'text/plain');
            res.send("Character not found!");
        } else {
            res.render('characters', { title: "Result for character name: " + character, data: result.results });
        }
    }).catch((err) => {
        res.render('error', { error: err });
    });

});

function mysort(para, array) {
    if (para == "height") {
        array.sort(function(a, b) { return (a.height - b.height); });
    } else if (para == "mass") {
        array.sort(function(a, b) { return (a.mass - b.mass); });
    }
    if (para == "name") {
        array.sort(function(a, b) { return a.name.localeCompare(b.name); });
    }
}

router.get('/characters', function(req, res, next) {
    if (charactersArray.length == 0) {
        swapi.get('http://swapi.co/api/people/').then((result) => {
            charactersArray = charactersArray.concat(result.results);
            return result.nextPage();
        }).then((result) => {
            charactersArray = charactersArray.concat(result.results);
            return result.nextPage();
        }).then((result) => {
            charactersArray = charactersArray.concat(result.results);
            return result.nextPage();
        }).then((result) => {
            charactersArray = charactersArray.concat(result.results);
            return result.nextPage();
        }).then((result) => {
            charactersArray = charactersArray.concat(result.results);
            charactersArray.filter(Boolean);
            charactersArray.filter(function(val) { return val !== null; }).join(", ");
            if (req.query.sort != "")
                mysort(req.query.sort);
            res.render('characters', { data: charactersArray });
        }).catch((err) => {
            console.log(err);
        });
    } else {
        if (req.query.sort != "") {
            mysort(req.query.sort);
            res.render('characters', { data: charactersArray });
        }
    }
});

router.get('/pagecall/:direct', function(req, res, next) {
    var page = req.params.direct;
    if (page == "next") {
        pageNumber++;
    } else if (page == "prev" && pageNumber > 1) {
        pageNumber--;
    }
    swapi.get(`http://swapi.co/api/people/?page=${pageNumber}`).then((result) => {
        currentArray = [...result.results];
        currentArray.filter(Boolean);
        currentArray.filter(function(val) { return val !== null; }).join(", ");
        if (req.query.sort != "")
            mysort(req.query.sort, currentArray);
        res.render('characters', { data: currentArray, pagination: 1 });
    }).catch((err) => {
        console.log(err);
    });
});

router.get('/planetresidents', function(req, res, next) {

    res.setHeader('Content-Type', 'application/json');

    (function sendResidents(i) {
        var planetName = "";
        var planetResidents = {};

        swapi.get(`http://swapi.co/api/planets/${i}/`).then((planet) => {
            planetName = planet.name;
            return planet.getResidents();
        }).then((residents) => {

            var residentNames = [];
            for (r in residents) {
                residentNames = residentNames.concat(residents[r].name);
            }
            planetResidents[planetName] = residentNames;
            res.write(JSON.stringify(planetResidents) + "\n\n");

        }).catch((err) => {
            console.log(err);
        }).then(() => i >= 60 || sendResidents(i + 1));
    })(1);

});

module.exports = router;