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
        url: "http://www.fairfaxcounty.gov/FFXGISAPI/v1/search?text=library&distance=5000&center=38.854,-77.357",
        method: "GET"
      });
    }

  }

}());
