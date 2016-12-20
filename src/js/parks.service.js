(function() {
  'use strict';

  angular.module("fairfax")
  .factory("ParkService", ParkService);

  ParkService.$inject = ["$http"];

  function ParkService($http){
    return {
      parkList: parkList
    };



    function parkList(){
      return $http({
        url: "http://www.fairfaxcounty.gov/FFXGISAPI/v1/search?feature=parks&format=json",
        method: "GET",
      });
    }

  }

}());
