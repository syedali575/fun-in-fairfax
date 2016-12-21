(function() {
  'use strict';

  angular.module("fairfax")
  .factory("CenterService", CenterService);

  CenterService.$inject = ["$http"];

  function CenterService($http){
    return {
      centerList: centerList
    };

    function centerList(coordinates){
      return $http({
        url: "http://www.fairfaxcounty.gov/FFXGISAPI/v1/search",
        method: "GET",
        params: {
          features: "communitycenters",
          format: "json",
          center: coordinates.latitude + "," + coordinates.longitude,
          distance: "100000"
        }
      });
    }
  }
}());
