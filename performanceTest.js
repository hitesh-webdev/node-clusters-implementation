var siege = require('siege');

siege()
  .on(8000)
  .concurrent(100)
  .get('/')
  .for(60).seconds
  .attack();