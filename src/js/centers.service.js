(function() {
  'use strict';

  angular.module("fairfax")
  .factory("CenterService", CenterService);

  CenterService.$inject = ["$http", "$q"];

  function CenterService($http, $q){
    return {
      centerList: centerList
    };

    /**
     * [centerList description]
     * @param  {[type]} coordinates [description]
     * @return {[type]}             [description]
     */
    function centerList(coordinates){
      if (!coordinates ||  !coordinates.latitude || !coordinates.longitude) {
        return $q.reject(new Error("You must provide an object with latitude and longitude properties"));
      }

      return $http({
        url: "http://www.fairfaxcounty.gov/FFXGISAPI/v1/search",
        method: "GET",
        params: {
          feature: "communitycenters",
          format: "json",
          center: coordinates.latitude + "," + coordinates.longitude,
          distance: "5000"
        }
      })
      .then(function successHandeler(response){
        console.log("path",response.data);
        return response.data.searchResults.results;
      });

    }
  }
}());
