"use strict"

// dependencies
const fs = require('fs'),
    querystring = require('querystring'),
    axios = require('axios'),
    async = require('async'),
        dotenv = require('dotenv');

// TAMU api key
dotenv.config();
const API_KEY = '4774872c6a2e4681b7007e7b2985deab';
const API_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx'

// geocode addresses
let meetingsData = [];

//subsitute with the outcome from aa02.js
let addresses = [ '109 West 129th Street',
  '240 West 145th Street',
  '469 West 142nd Street',
  '204 West 134th Street',
  '2044 Adam Clayton Powell Blvd.',
  '469 West 142nd Street',
  '521 W 126th St',
  '109 West 129th Street',
  '469 West 142nd Street',
  '2044 Seventh Avenue',
  '127 West 127th Street',
  '310 West 139th Street',
  '409 West 141st Street',
  '91 Claremont Avenue',
  '1727 Amsterdam Avenue',
  '469 West 142nd Street',
  '91 Claremont Avenue',
  '219 West 132nd Street',
  '211 West 129th Street',
  '425 West 144th Street',
  '204 West 134th Street',
  '506 Lenox Avenue',
  '1727 Amsterdam Avenue',
  '1854 Amsterdam Avenue',
  '469 West 142nd Street',
  '58-66 West 135th Street'];

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) {
    let query = {
        streetAddress: value,
        city: "New York",
        state: "NY",
        apikey: API_KEY,
        format: "json",
        version: "4.01"
    };
    
    //create an empty object that holds a meeting information
    const addGeocoded = {
        address: "",
        latLong:{}
    }

    // construct a querystring from the `query` object's values and append it to the api URL
    let apiRequest = API_URL + '?' + querystring.stringify(query);

    (async () => {
        try {
            // 		const response = await got(apiRequest);
            //console.log(apiRequest)

            // 		const response = await axios.get(apiRequest);

            axios.get(apiRequest)
                .then(function(response) {
                    // handle success
                    console.log(apiRequest)
                    const geocode = response.data.OutputGeocodes[0].OutputGeocode
                    
                    //bind data to addGeocoded
                    addGeocoded.latLong.lat = geocode.Latitude
                    addGeocoded.latLong.long = geocode.Longitude
                    addGeocoded.address = value
                
                    //console.log(addGeocoded)
                    //push addGeocoded to meeting array
                   meetingsData.push(addGeocoded);

                })
                .catch(function(error) {
                    // handle error
                    console.log(error);
                })
                .finally(function() {
                    // always executed
                });

        }
        catch (error) {
            console.log(error.response);
        }
    })();

    // sleep for a couple seconds before making the next request
    setTimeout(callback, 2000);
}, function() {
    fs.writeFileSync('data/first.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log(`Number of meetings in this zone: ${meetingsData.length}`);
    
    //outcome: Number of meetings in this zone: 26
});