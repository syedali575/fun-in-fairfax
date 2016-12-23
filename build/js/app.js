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
      controller: "LibraryController",
      controllerAs: "library"
    })

    .state({
      name: "rec-centers",
      url: "/rec-centers",
      templateUrl: "views/rec.template.html",
      controller: "CenterController",
      controllerAs: "center"
    })

    .state({
      name: "shopping-centers",
      url: "/shopping-centers",
      templateUrl: "views/shopping.template.html",
      controller: "ShoppingCenter",
      controllerAs: "shop"
    });




  }


}());

(function() {
  'use strict';

  angular.module("fairfax")
  .controller("CenterController", CenterController);

  CenterController.$inject = ["CenterService"];

  function CenterController(CenterService){

    var vm = this;
    vm.centerData = [];

    this.getCenter = function getCenter(){

      navigator.geolocation.getCurrentPosition(function locationHandeler(location){
        console.log(location);

        CenterService.centerList(location.coords)
        .then(function sucessHandeler(data){
          console.log("Getting Centers", data);

          vm.centerData = data.data.searchResults.results;

        })
        .catch(function failHandeler(xhr){
          console.log("Unable to communicate", xhr);
        });


      });
    };
  }
}());

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
          feature: "communitycenters",
          format: "json",
          center: coordinates.latitude + "," + coordinates.longitude,
          distance: "100000"
        }
      });
    }
  }
}());

(function() {
  'use strict';

  angular.module("fairfax")
  .controller("LibraryController", LibraryController);

  LibraryController.$inject = ["LibraryService"];

  function LibraryController(LibraryService){

    var vm = this;
    vm.message = "";
    vm.libraryData = [];

    this.getLibrary = function getLibrary(){

      navigator.geolocation.getCurrentPosition(function locationHandeler(location){
        console.log(location);

        LibraryService.libraryList(location.coords)
        .then(function sucessHandeler(data){
          console.log("Getting Libraries", data);

          vm.libraryData = data.data.searchResults.results;
        })
        .catch(function failHandeler(xhr){
          console.log("Unable to communicate", xhr);

          vm.message = "We are unable to retrieve library list at this momment";
        });

      });
    };
  }
}());

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
          distance: "100000"
        }
      });
    }
  }
}());

(function() {
  'use strict';

  angular.module("fairfax")
  .controller("ParksController", ParksController);

  ParksController.$inject = ["ParkService"];

  function ParksController(ParkService){

    var vm = this;
    vm.message = "";
    vm.parkData = [];

    this.getParks = function getParks(){

      navigator.geolocation.getCurrentPosition(function locationHandeler(location) {
        console.log(location);

        ParkService.parkList(location.coords)
        .then(function sucessHandeler(data){
          console.log("In Controller", data);

          vm.parkData = data;
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

  ParkService.$inject = ["$http", "$q"];

  function ParkService($http, $q){
    return {
      parkList: parkList
    };

    /**
     * [This function retrieve list of parks based on users geo position]
     * @param  {Object} coordinates object coordinates with two properties: latitude and longitude
     * @return {Promise}             [description]
     */
    function parkList(coordinates){
      if (!coordinates ||  !coordinates.latitude || !coordinates.longitude) {
        console.log("I'm in if else statement in park list");
        return $q.reject(new Error("You must provide an object with latitude and longitude properties"));
      }
      // else {
      //   return $q.resolve( "Resolving" );
      // }



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
