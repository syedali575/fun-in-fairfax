(function() {
  'use strict';

  angular.module("fairfax")
  .factory("ParkService", ParkService);

  ParkService.$inject = ["$http"];

  function ParkService($http){
    return {
      parkList: parkList
    };

    /**
     * [This function retrieve list of parks based on users geo position]
     * @param  {Object} coordinates object coordinates with two properties: latitude and longitude
     * @return {Promise}             [description]
     */
    function parkList(coordinates){
      // TODO check coordinates
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
        console.log("path",response.data);
        return response.data.searchResults.results;
      });
    }

  }
}());
