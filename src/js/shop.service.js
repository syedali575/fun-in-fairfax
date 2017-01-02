(function() {
  'use strict';

  angular.module("fairfax")
  .factory("ShopService", ShopService);


  ShopService.$inject = ["$http", "$q"];

  function ShopService($http, $q){
    return {
      shopList: shopList
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
        console.log(response);
        return response.data.searchResults.results;
      });
    }
  }

}());
