(function() {
  'use strict';

  angular.module("fairfax")
  .factory("LibraryService", LibraryService);

  LibraryService.$inject = ["$http", "$q"];

  function LibraryService($http, $q){
    return {
      libraryList: libraryList
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
        console.log("path",response.data);
        return response.data.searchResults.results;
      });
    }
  }
}());
