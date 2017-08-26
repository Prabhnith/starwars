
## Using the StarWar API

A little exercise using a Star Wars API https://swapi.co/

Making a small express server with endpoints centered around Star Wars. This will hopefully demonstrate to us abilities
to make an express app, consume data from an API, and manipulate that data into some desired way

## Endpoints

* '/character/:name' - Returns an EJS view (nothing too fancy) with data about the given character. 
  (Needs to work with at least 'luke', 'han', 'leia', and 'rey')
  
  ![screenshot of USE](https://github.com/Prabhnith/starwars/raw/master/screenshots/searchcharacter.png "Search CHARACTERS")

* '/characters' - Returns raw JSON of 50 characters (doesn't matter which 50). 
  This endpoint should be able to take a query parameter in the URL called 'sort' and the potential sort parameters 
  will be 1 of the following, ['name', 'mass', 'height'] So the endpoint '/characters?sort=height' 
  should return JSON of 50 characters sorted by their height.
  
![screenshot of USE](https://github.com/Prabhnith/starwars/raw/master/screenshots/characters.png "CHARACTERS")

* '/planetresidents' - Return raw JSON in the form {planetName1: [characterName1, characterName2], 
  planetName2: [characterName3]}. So it is an object where the keys are the planet names, and the values are 
  lists of residents names for that planet
  
![screenshot of API](https://github.com/Prabhnith/starwars/raw/master/screenshots/planetResidents.png "planetResidents")

* making paginated calls, limit the response to 10, so you can actually demonstrate using pagination to get all of the data

![screenshot of API](https://github.com/Prabhnith/starwars/raw/master/screenshots/pagecall.png "pagecall")

### Requirements
1. NodeJS
2. Express
3. SWAPI API
