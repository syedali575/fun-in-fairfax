(function() {
  'use strict';

  angular.module("fairfax")
  .factory("CenterService", CenterService);

  var storedItems = JSON.parse(localStorage.getItem("center"));
  storedItems = storedItems || {coordinates:{}};

  CenterService.$inject = ["$http", "$q"];

  function CenterService($http, $q){
    return {
      centerList: centerList,
      updateLocalStorage: updateLocalStorage
    };

    /**
    * This function retrieve list of Rec-centers from a specific geolocation.
    * This function also execute location detail function for each location in array.
    * @param  {Object} coordinates Object coordinates with two properties: latitude and longitude
    * @return {Promise}             It returns promise object.
    */
    function centerList(coordinates){
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
          feature: "communitycenters",
          format: "json",
          center: coordinates.latitude + "," + coordinates.longitude,
          distance: "100000"
        }
      })
      .then(function successHandeler(response){

        var allPromises = response.data.searchResults.results.map(function parkDetail(each){
          console.log(each.url);
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
    * @param  {Object} parkUrl [URL for each Rec-center location]
    * @return {Object}         [It returns a promise object]
    */
    function locationDetail(centerUrl){
      return $http({
        url: centerUrl,
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
    * This function stores Rec-centers locations to local storage
    * @param  {Object} list        Object containing array of locations list
    * @param  {Object} coordinates Coordinates of user's current location
    * @return {Void}
    */
    function updateLocalStorage(list, coordinates){

      var data = {
        list: list,
        coordinates: {latitude: coordinates.latitude, longitude: coordinates.longitude}
      };

      localStorage.setItem("center", angular.toJson(data));
    }
  }
}());
