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
    * [This function retrieves list of shopping centers in Fairfax County by location of user]
    * @param  {Object} coordinates [object coordinates with two properties: latitude and longitude]
    * @return {Promise}             [It returns promise object]
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

      console.log("Am I making ajax call?");

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
      .then(function successHandeler(response){
        console.log("Getting Shopping data via ajax",response.data);

        var allPromises = response.data.searchResults.results.map(function shopDetail(each){
          console.log("Each location URL", each.url);
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
    * @param  {[type]} parkUrl [description]
    * @return {[type]}         [description]
    */
    function locationDetail(storeUrl){
      return $http({
        url: storeUrl,
        method: "GET"
      })
      .then(function parkSuccessHandeler(response){
        console.log("Log me please",response.data);
        return response.data;
      })
      .catch(function parkFailureHandeler(xhr){
        console.log("Unable to communicate", xhr);
      });
    }

    function updateLocalStorage(list, coordinates){

      var data = {
        list: list,
        coordinates: {latitude: coordinates.latitude, longitude: coordinates.longitude}
      };
      console.log("Saving list of shopping centers to localStorage", data);
      localStorage.setItem("shop", angular.toJson(data));
    }
  }
}());
