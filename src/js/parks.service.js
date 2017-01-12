(function() {
  'use strict';

  angular.module("fairfax")
  .factory("ParkService", ParkService);

  var storedItems = JSON.parse(localStorage.getItem("list"));
  storedItems = storedItems || {coordinates:{}};


  ParkService.$inject = ["$http", "$q"];

  function ParkService($http, $q){
    return {
      parkList: parkList,
      updateLocalStorage: updateLocalStorage
    };

    /**
    * This function retrieve list of parks from a specific geolocation.
    * This function also execute location detail function for each location in array.
    * @param  {Object} coordinates Object coordinates with two properties: latitude and longitude
    * @return {Promise}             It returns promise object.
    */
    function parkList(coordinates){

      if (!coordinates ||  !coordinates.latitude || !coordinates.longitude) {
        return $q.reject(new Error("You must provide an object with latitude and longitude properties"));
      }

      var cLat = Math.floor(coordinates.latitude);
      var cLon = Math.floor(coordinates.longitude);
      var sLat = Math.floor(storedItems.coordinates.latitude);
      var sLon = Math.floor(storedItems.coordinates.longitude);

      if (cLat === sLat && cLon === sLon){
        return $q.resolve(storedItems.list);
      }


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

        var allPromises = response.data.searchResults.results.map(function parkDetail(each){
          return locationDetail(each.url);
        });
        return $q.all(allPromises);
      })
      .then(function allThingsDone(itemsDetails) {
        updateLocalStorage(itemsDetails, coordinates);
        return itemsDetails;
      });
    }


    /**
    * This function retrives detail of each location.
    * @param  {Object} parkUrl [URL for each park location]
    * @return {Object}         [It returns a promise object]
    */
    function locationDetail(parkUrl){
      return $http({
        url: parkUrl,
        method: "GET",
      })
      .then(function parkSuccessHandeler(response){
        return response.data;
      })
      .catch(function parkFailureHandeler(xhr){
        console.log("Unable to communicate", xhr);
      });
    }


    /**
    * This function stores park locations to local storage
    * @param  {Object} list        [Object containing array of locations list]
    * @param  {Object} coordinates [Coordinates of user's current location]
    * @return {Void}
    */
    function updateLocalStorage(list, coordinates){

      var data = {
        list: list,
        coordinates: {latitude: coordinates.latitude, longitude: coordinates.longitude}
      };
      localStorage.setItem("list", angular.toJson(data));
    }
  }
}());
