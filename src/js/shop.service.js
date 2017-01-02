(function() {
  'use strict';

  angular.module("fairfax")
  .factory("ShopService", ShopService);
// =================================
// var storedItems =
// JSON.parse(localStorage.getItem("shop"));
// storedItems = storedItems || {coordinates:{}};
// ==================================



  ShopService.$inject = ["$http", "$q"];

  function ShopService($http, $q){
    return {
      shopList: shopList
      // updateLocalStorage: updateLocalStorage
    };


    /**
     * [This function retrieves list of shopping centers in Fairfax County by location of user]
     * @param  {Object} coordinates [object coordinates with two properties: latitude and longitude]
     * @return {Promise}             [description]
     */
    function shopList(coordinates){
      if (!coordinates  || !coordinates.latitude || !coordinates.longitude){
        return $q.reject(new Error("You must provide an object with latitude and longitude properties"));
      }


      // console.log("In shopList Function",storedItems.coordinates.latitude);
      // console.log("Able to access array of shops",storedItems.shop);

      // var cLat = Math.floor(coordinates.latitude);
      // var cLon = Math.floor(coordinates.longitude);
      // var sLat = Math.floor(storedItems.coordinates.latitude);
      // var sLon = Math.floor(storedItems.coordinates.longitude);
      //
      // if (cLat === sLat && cLon === sLon){
      //   return $q.resolve(storedItems.list);
      // }

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
        console.log("Getting Shopping data via ajax",response);
        // updateLocalStorage(response.data.searchResults.results, coordinates);
        return response.data.searchResults.results;
      });
    }

    // function updateLocalStorage(shop, coordinates){
    //
    //   var data = {
    //     shop: shop,
    //     coordinates: {latitude: coordinates.latitude, longitude: coordinates.longitude}
    //   };
    //   console.log("Saving list of shopping centers to localStorage", data);
    //   localStorage.setItem("shop", angular.toJson(data));
    // }




  }

}());
