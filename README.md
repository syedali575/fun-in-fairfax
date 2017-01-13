# FuninFairfax

# INTRODUCTION:
Families, friends, and other social groups can use this site to look up outdoor and indoor entertainment locations in Fairfax County to plan a day of fun activities. This websites also provides other external useful links such as: weather conditions, maps, directions, and other resources in Fairfax County.

This application is designed to access the following resources in Fairfax County:
Parks, Libraries, Recreational centers, and shopping centers.

Currently this application is utilizing a static coordinate (latitude & longitude) to search for entertainment locations and provide closest results by distance. In the next phase of development of this web application I would like to add a feature that allows user to find entertainment location based on user's current geolocation and provide closest results by distance in order. I would also like to add capability to rearrange today's plan items; if user wishes to change the order of visit.


# FUNCTIONALITY:
- User can choose Fairfax County resources from navigation bar and search for locations in Fairfax County.

- User can add locations of choice to today's plan view by clicking on add to today's plan button.

 - User can switch to today's plan view from navigation bar to see the list of their choices to visit for the day.

- User can delete exiting today's plan list, by clicking clear today's plan button in today's     plan view.

# DATA:
This web application utilizes following Fairfax County API: http://www.fairfaxcounty.gov/FFXGISAPI


# BROWSER & RESPONSIVE TESTING:
This web application is designed to responsive and has been tested on: Chrome, Safari, Firefox and IE 11. This is also fully functional on mobile devices.


# TESTING:
Testing suite has been implemented in the web application by utilizing: GRUNT, KARMA, MOCHA, & Chai.


# REQUIREMENTS:
This application requires a static coordinates in order to search for Fairfax County resources in vicinity. Currently this application is using following coordinates:

```var coordinates = {
  latitude: 38.7799510,
  longitude: -77.2829640
};
```

# FAQ:
Distance of location search (in ajax call) can be modified based on how far user is willing to travel. Recommended search distance is 2000 meters, so that user can find locations fairly close to them. following is example of Ajax call and parameters.

```
return $http({
  url: "http://www.fairfaxcounty.gov/FFXGISAPI/v1/search",
  method: "GET",
  params:{
    feature: "shoppingcenters",
    format: "json",
    center: coordinates.latitude + "," + coordinates.longitude,
    distance: "10000"
  }
})
```

# FRAME WORK AND DEPENDENCIES FOR THIS PROJECT:
"angular": "^1.6.0",
"angular-ui-router": "^0.3.2",
"jquery": "^3.1.1"

"devDependencies": {
"angular-mocks": "^1.6.0",
"angularjs-geolocation": "^0.1.3",
"chai": "^3.5.0",
"grunt": "^1.0.1",
"grunt-contrib-clean": "^1.0.0",
"grunt-contrib-concat": "^1.0.1",
"grunt-contrib-connect": "^1.0.2",
"grunt-contrib-copy": "^1.0.0",
"grunt-contrib-jshint": "^1.1.0",
"grunt-contrib-sass": "^1.0.0",
"grunt-contrib-watch": "^1.0.0",
"grunt-karma": "^2.0.0",
"karma": "^1.3.0",
"karma-chai": "^0.1.0",
"karma-chrome-launcher": "^2.0.0",
"karma-coverage": "^1.1.1",
"karma-firefox-launcher": "^1.0.0",
"karma-ie-launcher": "^1.0.0",
"karma-mocha": "^1.3.0",
"karma-phantomjs-launcher": "^1.0.2",
"karma-safari-launcher": "^1.0.0",
"mocha": "^3.2.0",
"phantomjs-prebuilt": "^2.1.14"


# MAINTAINER:
This web application is created (December 2016) and maintained by Syed Ali who can be reached at sali3@cox.net. This application is my final project for The Iron Yard Front Engineering Program.
