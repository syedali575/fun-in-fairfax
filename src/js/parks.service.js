(function() {
  'use strict';

  angular.module("fairfax")
  .factory("ParkService", ParkService);

  var storedItems = JSON.parse(localStorage.getItem("list"));
  storedItems = storedItems || {coordinates:{}};
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
    * @return {Promise}             It returns promise object
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

      console.log("Making ajax call next");

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

        var allPromises = response.data.searchResults.results.map(function parkDetail(each){
          console.log("Each location URL",each.url);
          return locationDetail(each.url);
        });
        return $q.all(allPromises);
      })
      .then(function allThingsDone(itemsDetails) {
        console.log("itemsDetails & coordinates", itemsDetails, coordinates);
        updateLocalStorage(itemsDetails, coordinates);
        return itemsDetails;
      });
    }


    /**
    * This function retrives detail of each location.
    * @param  {[type]} parkUrl [description]
    * @return {[type]}         [description]
    */
    function locationDetail(parkUrl){
      return $http({
        url: parkUrl,
        method: "GET",
      })
      .then(function parkSuccessHandeler(response){
        console.log("Log me please",response.data);
        return response.data;
      })
      .catch(function parkFailureHandeler(xhr){
        console.log("Unable to communicate", xhr);
      });
    }



    /**
    * Stores list of search results and coordinates to localStorage
    * @param  {Object} list [list of search results and coordinates ]
    * @return {void}
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
