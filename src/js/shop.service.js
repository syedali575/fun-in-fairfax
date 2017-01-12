(function() {
  'use strict';

  angular.module("fairfax")
  .factory("ShopService", ShopService);

  var storedItems = JSON.parse(localStorage.getItem("shop"));
  storedItems = storedItems || {coordinates:{}};
  console.log(storedItems);



  ShopService.$inject = ["$http", "$q"];

  function ShopService($http, $q){
    return {
      shopList: shopList,
      updateLocalStorage: updateLocalStorage
    };


    /**
    * This function retrieve list of shops from a specific geolocation.
    * This function also execute location detail function for each location in array.
    * @param  {Object} coordinates Object coordinates with two properties: latitude and longitude
    * @return {Promise}             Resolution of this promise is a list of shopping centers locations and details.
    */
    function shopList(coordinates){
      if (!coordinates  || !coordinates.latitude || !coordinates.longitude){
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
        params:{
          feature: "shoppingcenters",
          format: "json",
          center: coordinates.latitude + "," + coordinates.longitude,
          distance: "10000"
        }
      })
      .then(function successHandeler(response){

        var allPromises = response.data.searchResults.results.map(function shopDetail(each){
          return locationDetail(each.url);
        });
        return $q.all(allPromises);
      })
      .then(function allThingsDone(itemsDetails){
        console.log("itemsDetails & coordinates", itemsDetails, coordinates);
        updateLocalStorage(itemsDetails, coordinates);
        return itemsDetails;
      });
    }

    /**
    * This function retrives detail of each location.
    * @param  {Object} parkUrl [url to make an ajax call]
    * @return {Promise}         [It returns promise object]
    */
    function locationDetail(storeUrl){
      return $http({
        url: storeUrl,
        method: "GET"
      })
      .then(function parkSuccessHandeler(response){
        return response.data;
      })
      .catch(function parkFailureHandeler(xhr){
        console.log("Unable to communicate", xhr);
      });
    }


    /**
     * This function stores shop locations to local storage
     * @param  {Object} list        [Object containing array of locations list]
     * @param  {Object} coordinates [Coordinates of user's current location]
     * @return {Void}
     */
    function updateLocalStorage(list, coordinates){

      var data = {
        list: list,
        coordinates: {latitude: coordinates.latitude, longitude: coordinates.longitude}
      };
      localStorage.setItem("shop", angular.toJson(data));
    }
  }
}());
