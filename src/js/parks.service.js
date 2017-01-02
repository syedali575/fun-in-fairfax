(function() {
  'use strict';

  angular.module("fairfax")
  .factory("ParkService", ParkService);

  var storedItems = JSON.parse(localStorage.getItem("list"));
  var previouslyStoredParks = storedItems || {};
  console.log(storedItems);


  ParkService.$inject = ["$http", "$q"];

  function ParkService($http, $q){
    return {
      parkList: parkList,
      updateLocalStorage: updateLocalStorage
    };

    /**
     * [This function retrieve list of parks based on users geo position]
     * @param  {Object} coordinates object coordinates with two properties: latitude and longitude
     * @return {Promise}             [description]
     */
    function parkList(coordinates){
      if (!coordinates ||  !coordinates.latitude || !coordinates.longitude) {
        return $q.reject(new Error("You must provide an object with latitude and longitude properties"));
      }

      console.log("In parkList Function",storedItems.coordinates.latitude);
      console.log("Able to access array of parks",storedItems.list);

      if (coordinates.latitude === storedItems.coordinates.latitude && coordinates.longitude === storedItems.coordinates.longitude){
        return $q.resolve(storedItems.list);
      }

      // if I have list of parks for current coordinates I do not need to make an ajax call
      // instead... I can retrieve it from localStorage and return a promise that resolves with data

      return $http({
        url: "http://www.fairfaxcounty.gov/FFXGISAPI/v1/search",
        method: "GET",
        params: {
          feature: "parks",
          format: "json",
          center: coordinates.latitude + "," + coordinates.longitude,
          distance: "10000"
        }
      })
      .then(function successHandeler(response){
        console.log("Getting Park Data via ajax",response.data);
        updateLocalStorage(response.data.searchResults.results, coordinates);
        return response.data.searchResults.results;
      });
    }

    /**
     * Stores list of search results and coordinates to localStorage
     * @param  {Object} list [list of search results and coordinates ]
     * @return {void}      [description]
     */
    function updateLocalStorage(list, coordinates){

      var data = {
        list: list,
        coordinates: {latitude: coordinates.latitude, longitude: coordinates.longitude}
      };
      console.log("Saving list of parks to localStorage", data);
      localStorage.setItem("list", angular.toJson(data));
    }

  }
}());
