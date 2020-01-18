
(function() {
    var placesAutocomplete = places({
      appId: PLACES_APPID,
      apiKey: PLACES_API_KEY,
      container: document.querySelector('#address')
    });

    
    //var city
    var $address = document.querySelector('#address')
    placesAutocomplete.on('change', function(e) {
      $address.textContent = e.suggestion.value
      globalCity = e.suggestion.name;
      coordinates = e.suggestion.latlng;
      changeMapCoordinates(coordinates)
      console.log("test " + coordinates)
    });
  
    placesAutocomplete.on('clear', function() {
      $address.textContent = 'none';
    });
    
  
  })
  ();

function changeMapCoordinates() {
  console.log(coordinates);
  var lat = coordinates.lat;
  var lng = coordinates.lng;
  
  // myMap.panTo([lat, lng]);
  // myMap.panTo([40.7309, -73.9872]);
  myMap.setView(new L.LatLng(lat, lng), 12, { animation: true });
  
};


////MAP/////////////////


  // L.marker([51.941196,4.512291], {icon: redMarker}).addTo(map);
// Create initial map object
// Set the longitude, latitude, and the starting zoom level
var myMap = L.map("map", {
    center: [33.4484, -112.0740],
    zoom: 6
  });

  
  // Add a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: MAP_API
  }).addTo(myMap);
  
 var RestaurantData;

 
    //  // Creates a red marker with the coffee icon
    //  var redMarker = L.AwesomeMarkers.icon({
    //   icon: 'coffee',
    //   markerColor: 'red'
    // });

 function createMarkers() {      
  RestaurantData.forEach(function(d) {
    var marker = L.marker([+d.Lat, +d.Long])
      .bindPopup(d.Res_Name + "<br>" + d.Address)      
      marker.addTo(myMap)
    // L.marker([+d.Lat, +d.Long], {icon: redMarker})
    //   .bindPopup(d.Res_Name + "<br>" + d.Address)      
    //   .addTo(myMap)
  })

};

////////BAR CHART////////////
function barChart() {

  function filterCities(City) {
    return City.Avg_Cost_2 > 5;
  }

// 2. Use filter() to pass the function as its argument
var filteredCities = RestaurantData.filter(filterCities);
// console.log(filteredCities);

// 3. Use the map method with the arrow function to return all the filtered cities.
var cities = filteredCities.map(city => city.City);
// console.log(cities);

// 4. Use the map method with the arrow function to return all the filtered cities population.
var avgCost = filteredCities.map(city => city.Avg_Cost_2);
// console.log(avgCost);

var barData = [{
  type: 'bar',
  // x: avgCost,
  // y: cities,
  x: cities,
  y: avgCost,
  // orientation: 'h',
  transforms: [{
    type: 'aggregate',
    groups: cities,
    aggregations: [
      {target: 'y', func: 'avg', enabled: true},
    ],
    transforms: [{
      type: 'sort',
      target: 'y',
      order: 'descending'
    }]
  }]
}];
var layout = {
    title: "Average Cost by City",
    xaxis: { categoryorder: 'descending',
             categoryarray: avgCost },
    yaxis: { title: "Avg Cost for Two" }
   // yaxis: { title: "2017 Population"}
  };

//console.log(barData)
Plotly.plot('myBar', barData, layout)

};

///////PIE CHART///////////////
function pieChart() {

  // Get counts for each rating:
  var expensesCount = d3.nest()
  .key(function(d) { return d.RatingText; })
  .rollup(function(v) { return v.length; })
  .entries(RestaurantData);
  // console.log((expensesCount));
  
  var ratingGroup = expensesCount

  rating = ratingGroup.map(function(o){return o.key});
  ratingCount = ratingGroup.map(function(o){return o.value});
  // console.log(rating);
  // console.log(ratingCount);

  var pieData = [{
    values: ratingCount,
    labels: rating,
    type: 'pie'
  }];

  var layout = {
    height: 400,
    width: 500,
    title: "Restaurants by Rating"
  };

  Plotly.newPlot('myPie', pieData, layout);
};

d3.csv("../static/data/Restaurants2.csv").then(function(csv) {
  RestaurantData = csv;
  createMarkers();
  barChart();
  pieChart();
});




