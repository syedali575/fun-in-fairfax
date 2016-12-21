(function() {
  'use strict';

  angular.module("fairfax", ["ui.router"])
    .config(routerConfig);


  routerConfig.$inject = ["$stateProvider"];

  function routerConfig($stateProvider){

    $stateProvider

    .state({
      name: "home",
      url: "",
      templateUrl: "views/home.template.html"
    })


    .state({
      name: "parks",
      url: "/parks",
      templateUrl: "views/parks.template.html",
      controller: "ParksController",
      controllerAs: "park"
    })

    .state({
      name: "libraries",
      url: "/libraries",
      templateUrl: "views/libraries.template.html",
      controller: "",
      controllerAs: ""
    })

    .state({
      name: "rec-centers",
      url: "/rec-centers",
      templateUrl: "views/rec.template.html",
      controller: "",
      controllerAs: ""
    })

    .state({
      name: "events",
      url: "/events",
      templateUrl: "views/events.template.html",
      controller: "",
      controllerAs: ""
    });




  }


}());

(function() {
  'use strict';

  // angular.module("fairfax")
  // .controller("LibrariesController", LibrariesController);
  //
  // LibrariesController.$inject = ["LibrariesService"];





}());


(function() {
  'use strict';

  angular.module("fairfax")
  .controller("ParksController", ParksController);

  ParksController.$inject = ["ParkService"];

  function ParksController(ParkService){
    // console.log("in ParksController");

    var vm = this;
    vm.message = "";
    vm.parkData = [];

    this.getParks = function getParks(){

      navigator.geolocation.getCurrentPosition(function locationHandeler(location) {
      console.log(location);


      ParkService.parkList(location.coords)
      .then(function sucessHandeler(data){
        console.log("Its working", data);
        vm.parkData = data.data.searchResults.results;
      })
      .catch(function failHandeler(xhr){
        console.log("Unable to communicate", xhr);
        vm.message = "We are unable to communicate, please try again";

      });

      });

    };
  }
}());

(function() {
  'use strict';

  angular.module("fairfax")
  .factory("ParkService", ParkService);

  ParkService.$inject = ["$http"];

  function ParkService($http){
    return {
      parkList: parkList
    };



    function parkList(coordinates){
      return $http({
        url: "http://www.fairfaxcounty.gov/FFXGISAPI/v1/search",
        method: "GET",
        params: {
          feature: "parks",
          format: "json",
          center: coordinates.latitude + "," + coordinates.longitude,
          distance: "10000"
        }

      });
    }

  }

}());
