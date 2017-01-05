(function() {
  'use strict';

  angular.module("fairfax", ["ui.router"])
    .config(routerConfig);


  routerConfig.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"];

  function routerConfig($stateProvider, $urlRouterProvider, $locationProvider){

    $urlRouterProvider.when("", "/");
    $locationProvider.hashPrefix("");

    $stateProvider

    .state({
      name: "home",
      url: "/",
      templateUrl: "views/home.template.html"
    })


    .state({
      name: "parks",
      url: "/parks",
      templateUrl: "views/parks.template.html",
      controller: "ParksController",
      controllerAs: "parkcontroller"
    })

    .state({
      name: "libraries",
      url: "/libraries",
      templateUrl: "views/libraries.template.html",
      controller: "LibraryController",
      controllerAs: "librarycontroller"
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
      controller: "ShopController",
      controllerAs: "shop"
    })

    .state({
      name: "todays-plan",
      url: "/todays-plan",
      templateUrl: "views/plan.template.html",

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
    vm.message = undefined;
    vm.centerData = [];

    /**
    * [This function acquires location (latitude and longitude) of a user and execute centerList function]
    * @return {Void}
    */
    this.getCenter = function getCenter(){

      navigator.geolocation.getCurrentPosition(function locationHandeler(location){
        console.log(location);

        CenterService.centerList(location.coords)
        .then(function sucessHandeler(data){
          console.log("Getting Centers", data);
          vm.centerData = data;
        })
        .catch(function failHandeler(xhr){
          console.log("Unable to communicate", xhr);
          vm.message = "We are unable to communicate due to network outage, please contact your Network Administrator";
        });
      });
    };
  }
}());

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
     * [This function retrieve list of rec-centers based on users geo position]
     * @param  {Object} coordinates object coordinates with two properties: latitude and longitude
     * @return {Promise}             [description]
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

(function() {
  'use strict';

  angular.module("fairfax")
  .controller("LibraryController", LibraryController);

  LibraryController.$inject = ["LibraryService", "PlanService"];

  function LibraryController(LibraryService, PlanService){

    var vm = this;
    vm.message = undefined;
    vm.libraryData = [];

    /**
    * [This function acquires location (latitude and longitude) of a user and execute libraryList function]
    * @return {Void}
    */
    this.getLibrary = function getLibrary(){

      navigator.geolocation.getCurrentPosition(function locationHandeler(location){
        console.log(location);

        LibraryService.libraryList(location.coords)
        .then(function sucessHandeler(data){
          console.log("Getting Libraries", data);
          vm.libraryData = data;
        })
        .catch(function failHandeler(xhr){
          console.log("Unable to communicate", xhr);
          vm.message = "We are unable to communicate due to network outage, please contact your Network Administrator";
        });
      });
    };

    this.addToPlan = function addToPlan(data){
      PlanService.addToPlan(data);
    };

  }
}());

(function() {
  'use strict';

  angular.module("fairfax")
  .factory("LibraryService", LibraryService);


  var storedItems = JSON.parse(localStorage.getItem("libraries"));
  storedItems = storedItems || {coordinates:{}};
  console.log(storedItems);

  LibraryService.$inject = ["$http", "$q"];

  function LibraryService($http, $q){
    return {
      libraryList: libraryList,
      updateLocalStorage: updateLocalStorage
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

      var cLat = Math.floor(coordinates.latitude);
      var cLon = Math.floor(coordinates.longitude);
      var sLat = Math.floor(storedItems.coordinates.latitude);
      var sLon = Math.floor(storedItems.coordinates.longitude);

      if (cLat === sLat && cLon === sLon){
        return $q.resolve(storedItems.list);
      }

        console.log("Am I making ajax call?");

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
        console.log("Getting Libraries Data via ajax",response.data);

        var allPromises = response.data.searchResults.results.map(function libraryDetail(each){
          console.log(each.url);
          return locationDetail(each.url);
        });
        return $q.all(allPromises);
      })
      .then(function allThingDone(itemsDetails){
        console.log("itemsDetails & coordinates", itemsDetails, coordinates);
        updateLocalStorage(itemsDetails, coordinates);
        return itemsDetails;
      });
    }

    function locationDetail(libraryUrl){
      return $http({
        url: libraryUrl,
        method: "GET",
      })
      .then(function parkSuccessHandeler(response){
        console.log("Log me please",response.data);
        return response.data;
      })
      .catch(function parkFailureHandeler(xhr){
        console.log("Unable to communicate", xhr);
      });
    }

    /**
    * Stores list of search results and coordinates to localStorage
    * @param  {Object} list [list of search results and coordinates ]
    * @return {void}
    */
    function updateLocalStorage(list, coordinates){

      var data = {
        list: list,
        coordinates: {latitude: coordinates.latitude, longitude: coordinates.longitude}
      };
      console.log("Saving list of libraries to localStorage", data);
      localStorage.setItem("libraries", angular.toJson(data));
    }


  }
}());

(function() {
  'use strict';

  angular.module("fairfax")
  .controller("ParksController", ParksController);

  ParksController.$inject = ["$scope", "ParkService", "PlanService"];

  function ParksController($scope, ParkService, PlanService){

    var vm = this;
    vm.message = undefined;
    vm.message2 = undefined;
    vm.parkData = [];

    /**
    * [This function acquires location (latitude and longitude) of a user and execute parkList function]
    * @param {function} done this callback function excuted when the data is arrived
    * @return {Void}
    */
    this.getParks = function getParks(done){
      if (typeof(done) !== "function"){
        done = function(){};
      }

      navigator.geolocation.getCurrentPosition(
        function locationHandeler(location) {
          console.log('location data', location);

          ParkService.parkList(location.coords)

          .then(function sucessHandeler(data){
            console.log("Getting Parks", data);
            vm.parkData = data;
            done();
          })
          .catch(function failHandeler(xhr){
            console.log("Unable to communicate", xhr);
            vm.message2 = "We are unable to communicate due to network outage, please contact your Network Administrator";
            done();
          });
        },
        function errorHandeler() {
          vm.message = "You must share your geolocation for this application to operate";
          $scope.$apply();
        }
      );
    };

    this.addToPlan = function addToPlan(data){
      PlanService.addToPlan(data);
    };

  }
}());

(function() {
  'use strict';

  angular.module("fairfax")
  .factory("ParkService", ParkService);

  var storedItems = JSON.parse(localStorage.getItem("list"));
  storedItems = storedItems || {coordinates:{}};
  console.log(storedItems);


  ParkService.$inject = ["$http", "$q"];

  function ParkService($http, $q){
    return {
      parkList: parkList,
      updateLocalStorage: updateLocalStorage
    };

    /**
    * [This function retrieve list of parks based on users geo position]
    * @param  {Object} coordinates object coordinates with two properties: latitude and longitude
    * @return {Promise}             [description]
    */
    function parkList(coordinates){
      if (!coordinates ||  !coordinates.latitude || !coordinates.longitude) {
        return $q.reject(new Error("You must provide an object with latitude and longitude properties"));
      }

      // console.log("In parkList Function",storedItems.coordinates.latitude);
      // console.log("Able to access array of parks",storedItems.list);

      var cLat = Math.floor(coordinates.latitude);
      var cLon = Math.floor(coordinates.longitude);
      var sLat = Math.floor(storedItems.coordinates.latitude);
      var sLon = Math.floor(storedItems.coordinates.longitude);

      if (cLat === sLat && cLon === sLon){
        return $q.resolve(storedItems.list);
      }

      console.log("Making ajax call next");

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
        console.log("Getting Park Data via ajax",response.data);

        var allPromises = response.data.searchResults.results.map(function parkDetail(each){
          console.log(each.url);
          return locationDetail(each.url);
        });
        return $q.all(allPromises);
      })
      .then(function allThingsDone(itemsDetails) {
        console.log("itemsDetails & coordinates", itemsDetails, coordinates);
        updateLocalStorage(itemsDetails, coordinates);
        return itemsDetails;
      });
    }



    function locationDetail(parkUrl){
      return $http({
        url: parkUrl,
        method: "GET",
      })
      .then(function parkSuccessHandeler(response){
        console.log("Log me please",response.data);
        return response.data;
      })
      .catch(function parkFailureHandeler(xhr){
        console.log("Unable to communicate", xhr);
      });
    }



    /**
    * Stores list of search results and coordinates to localStorage
    * @param  {Object} list [list of search results and coordinates ]
    * @return {void}
    */
    function updateLocalStorage(list, coordinates){

      var data = {
        list: list,
        coordinates: {latitude: coordinates.latitude, longitude: coordinates.longitude}
      };
      console.log("Saving list of parks to localStorage", data);
      localStorage.setItem("list", angular.toJson(data));
    }

  }
}());

(function() {
  'use strict';

  angular.module("fairfax")
  .factory("PlanService", PlanService);

  function PlanService(){
    return {
      addToPlan: addToPlan
    };

    function addToPlan(data){
      var todaysPlan = [];
      todaysPlan.push(data);
      // localStorage.setItem("plan", angular.toJson(todayPlan));
      console.log("addToPlan is working", data);
      console.log("Whats in todaysPlan", todaysPlan);
    }

  }

}());

(function() {
  'use strict';

  angular.module("fairfax")
  .controller("ShopController", ShopController);

  ShopController.$inject = ["ShopService"];

  function ShopController(ShopService){

    var vm = this;
    vm.message = undefined;
    vm.shopData = [];


    /**
    * [This function acquires location (latitude and longitude) of a user and execute shopList function]
    * @return {Void}
    */
    this.getShop = function getShop(){

      navigator.geolocation.getCurrentPosition(function locationHandeler(location){
        console.log(location);

        ShopService.shopList(location.coords)
        .then(function successHandeler(data){
          console.log("In Shop Controller", data);
          vm.shopData = data;
        })
        .catch(function failHandeler(xhr){
          console.log("Unable to Communicate", xhr);
          vm.message = "We are unable to communicate due to network outage, please contact your Network Administrator";
        });
      });
    };


  }

}());

(function() {
  'use strict';

  angular.module("fairfax")
  .factory("ShopService", ShopService);
// =================================
// var storedItems =
// JSON.parse(localStorage.getItem("shop"));
// storedItems = storedItems || {coordinates:{}};
// ==================================



  ShopService.$inject = ["$http", "$q"];

  function ShopService($http, $q){
    return {
      shopList: shopList
      // updateLocalStorage: updateLocalStorage
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


      // console.log("In shopList Function",storedItems.coordinates.latitude);
      // console.log("Able to access array of shops",storedItems.shop);

      // var cLat = Math.floor(coordinates.latitude);
      // var cLon = Math.floor(coordinates.longitude);
      // var sLat = Math.floor(storedItems.coordinates.latitude);
      // var sLon = Math.floor(storedItems.coordinates.longitude);
      //
      // if (cLat === sLat && cLon === sLon){
      //   return $q.resolve(storedItems.list);
      // }

      console.log("Am I making ajax call?");



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
        console.log("Getting Shopping data via ajax",response);
        // updateLocalStorage(response.data.searchResults.results, coordinates);
        return response.data.searchResults.results;
      });
    }

    // function updateLocalStorage(shop, coordinates){
    //
    //   var data = {
    //     shop: shop,
    //     coordinates: {latitude: coordinates.latitude, longitude: coordinates.longitude}
    //   };
    //   console.log("Saving list of shopping centers to localStorage", data);
    //   localStorage.setItem("shop", angular.toJson(data));
    // }




  }

}());
