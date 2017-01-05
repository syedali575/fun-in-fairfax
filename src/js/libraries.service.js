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
     * @return {Promise}             [description]
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

        console.log("Am I making ajax call?");

      return $http({
        url: "http://www.fairfaxcounty.gov/FFXGISAPI/v1/search",
        method: "GET",
        params: {
          feature: "libraries",
          format: "json",
          center: coordinates.latitude + "," + coordinates.longitude,
          distance: "100000"
        }
      })
      .then(function successHandeler(response){
        console.log("Getting Libraries Data via ajax",response.data);

        var allPromises = response.data.searchResults.results.map(function libraryDetail(each){
          console.log(each.url);
          return locationDetail(each.url);
        });
        return $q.all(allPromises);
      })
      .then(function allThingDone(itemsDetails){
        console.log("itemsDetails & coordinates", itemsDetails, coordinates);
        updateLocalStorage(itemsDetails, coordinates);
        return itemsDetails;
      });
    }

    function locationDetail(libraryUrl){
      return $http({
        url: libraryUrl,
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
      console.log("Saving list of libraries to localStorage", data);
      localStorage.setItem("libraries", angular.toJson(data));
    }


  }
}());
