(function() {
  'use strict';

  angular.module("fairfax")
  .factory("LibraryService", LibraryService);


  var storedItems = JSON.parse(localStorage.getItem("libraries"));
  storedItems = storedItems || {coordinates:{}};
  console.log(storedItems);

  LibraryService.$inject = ["$http", "$q"];

  function LibraryService($http, $q){
    return {
      libraryList: libraryList,
      updateLocalStorage: updateLocalStorage
    };

    /**
    * [This function retrieve list of libraries based on users geo position]
    * @param  {Object} coordinates object coordinates with two properties: latitude and longitude
    * @return {Promise}             Resolution of this promise is a list of library locations and details.
    */
    function libraryList(coordinates){
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
        url: "http://www.fairfaxcounty.gov/FFXGISAPI/v1/searc",
        method: "GET",
        params: {
          feature: "libraries",
          format: "json",
          center: coordinates.latitude + "," + coordinates.longitude,
          distance: "100000"
        }
      })
      .then(function successHandeler(response){

        var allPromises = response.data.searchResults.results.map(function libraryDetail(each){
          return locationDetail(each.url);
        });
        return $q.all(allPromises);
      })
      .then(function allThingDone(itemsDetails){
        updateLocalStorage(itemsDetails, coordinates);
        return itemsDetails;
      });
    }

    /**
    * This function makes an ajax call to get detail of each location
    * @param  {URL} libraryUrl URL of each location
    * @return {Promise}        Promise object
    */
    function locationDetail(libraryUrl){
      return $http({
        url: libraryUrl,
        method: "GET",
      })
      .then(function librarySuccessHandeler(response){
        return response.data;
      })
      .catch(function parkFailureHandeler(xhr){
        console.log("Unable to communicate in location details", xhr);
      });
    }

    /**
    * This function stores libraries locations to local storage
    * @param  {Object} list        [Object containing array of locations list]
    * @param  {Object} coordinates [Coordinates of user's current location]
    * @return {Void}
    */
    function updateLocalStorage(list, coordinates){

      var data = {
        list: list,
        coordinates: {latitude: coordinates.latitude, longitude: coordinates.longitude}
      };

      localStorage.setItem("libraries", angular.toJson(data));
    }
  }
}());
