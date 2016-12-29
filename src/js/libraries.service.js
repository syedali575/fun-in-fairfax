(function() {
  'use strict';

  angular.module("fairfax")
  .factory("LibraryService", LibraryService);

  LibraryService.$inject = ["$http"];

  function LibraryService($http){
    return {
      libraryList: libraryList
    };

    function libraryList(coordinates){
      return $http({
        url: "http://www.fairfaxcounty.gov/FFXGISAPI/v1/search",
        method: "GET",
        params: {
          feature: "libraries",
          format: "json",
          center: coordinates.latitude + "," + coordinates.longitude,
          distance: "5000"
        }
      });
    }
  }
}());
