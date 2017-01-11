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
      controllerAs: "centercontroller"
    })

    .state({
      name: "shopping-centers",
      url: "/shopping-centers",
      templateUrl: "views/shopping.template.html",
      controller: "ShopController",
      controllerAs: "shopcontroller"
    })

    .state({
      name: "todays-plan",
      url: "/todays-plan",
      templateUrl: "views/plan.template.html",
      controller: "PlanController",
      controllerAs: "plancontroller"


    });
  }
}());

(function() {
  'use strict';

  angular.module("fairfax")
  .controller("CenterController", CenterController);

  CenterController.$inject = ["$scope", "CenterService", "PlanService"];

  function CenterController($scope, CenterService, PlanService){

    var vm = this;
    vm.message = undefined;
    vm.message2 = undefined;
    vm.centerData = [];

    /**
    * [This function acquires location (latitude and longitude) of a user and execute centerList function]
    * @param {function} done this callback function excuted when the data is arrived
    * @return {Void}
    */
    this.getCenter = function getCenter(done){
      if (typeof(done) !== "function"){
        done = function(){};
      }

      navigator.geolocation.getCurrentPosition(
        function locationHandeler(location){
          console.log("location data",location);

          CenterService.centerList(location.coords)
          .then(function sucessHandeler(data){
            console.log("Getting Centers", data);
            vm.centerData = data;
            done();
          })
          .catch(function failHandeler(xhr){
            console.log("Unable to communicate", xhr);
            vm.message = "We are unable to communicate due to network outage, please contact your Network Administrator";
            done();
          });
        },
        function errorHandeler() {
          vm.message2 = "You must share your geolocation for this application to operate";
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
  .factory("CenterService", CenterService);

  var storedItems = JSON.parse(localStorage.getItem("center"));
  storedItems = storedItems || {coordinates:{}};
  console.log(storedItems);

  CenterService.$inject = ["$http", "$q"];

  function CenterService($http, $q){
    return {
      centerList: centerList,
      updateLocalStorage: updateLocalStorage
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
          feature: "communitycenters",
          format: "json",
          center: coordinates.latitude + "," + coordinates.longitude,
          distance: "100000"
        }
      })
      .then(function successHandeler(response){
        console.log("Getting Rec-Center Data via ajax",response.data);

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

    function locationDetail(centerUrl){
      return $http({
        url: centerUrl,
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
     * This function stores Rec-centers locations to local storage
     * @param  {Object} list        [Object containing array of locations list]
     * @param  {Object} coordinates [Coordinates of user's current location]
     * @return {Void}
     */
    function updateLocalStorage(list, coordinates){

      var data = {
        list: list,
        coordinates: {latitude: coordinates.latitude, longitude: coordinates.longitude}
      };
      console.log("Saving list of Rec-Centers to localStorage", data);
      localStorage.setItem("center", angular.toJson(data));
    }
  }
}());

(function() {
  'use strict';

  angular.module("fairfax")
  .controller("LibraryController", LibraryController);

  LibraryController.$inject = ["$scope", "LibraryService", "PlanService"];

  function LibraryController($scope, LibraryService, PlanService){

    var vm = this;
    vm.message = undefined;
    vm.message2 = undefined;
    vm.libraryData = [];

    /**
    * [This function acquires location (latitude and longitude) of a user and execute libraryList function]
    * @param {function} done this callback function excuted when the data is arrived
    * @return {Void}
    */
    this.getLibrary = function getLibrary(done){
      if (typeof(done) !== "function"){
        done = function(){};
      }

      // navigator.geolocation.getCurrentPosition(
      //   function locationHandeler(location){
      //     console.log("location data",location);
      var coordinates = {
        latitude: 38.7799510,
        longitude: -77.2829640
      };

          LibraryService.libraryList(coordinates)
          .then(function sucessHandeler(data){
            console.log("Getting Libraries", data);
            vm.libraryData = data;
            done();
          })
          .catch(function failHandeler(xhr){
            console.log("Unable to communicate", xhr);
            vm.message = "We are unable to communicate due to network outage, please contact your Network Administrator";
            done();
          });
      //   },
      //   function errorHandeler() {
      //     vm.message2 = "You must share your geolocation for this application to operate";
      //     $scope.$apply();
      //   }
      // );
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
    * @return {Promise}             Promise object
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
          console.log("Each URL",each.url);
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

    /**
    * This function makes an ajax call to get detail of each location
    * @param  {URL} libraryUrl URL of each location
    * @return {Promise}        Promise object
    */
    function locationDetail(libraryUrl){
      return $http({
        url: libraryUrl,
        method: "GET",
      })
      .then(function librarySuccessHandeler(response){
        console.log("Log me please",response.data);
        return response.data;
      })
      .catch(function parkFailureHandeler(xhr){
        console.log("Unable to communicate in location details", xhr);
      });
    }

    /**
     * This function stores libraries locations to local storage
     * @param  {Object} list        [Object containing array of locations list]
     * @param  {Object} coordinates [Coordinates of user's current location]
     * @return {Void}
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
    * @param {function} done this callback function get executed when the data is arrived
    * @return {Void}
    */
    this.getParks = function getParks(done){
      if (typeof(done) !== "function"){
        done = function(){};
      }

      // navigator.geolocation.getCurrentPosition(
      //   function locationHandeler(location) {
      //     console.log("location data", location);
      var coordinates = {
        latitude: 38.7799510,
        longitude: -77.2829640
      };

          ParkService.parkList(coordinates)
          .then(function sucessHandeler(data){
            console.log("Getting Parks", data);
            vm.parkData = data;
            done();
          })
          .catch(function failHandeler(xhr){
            console.log("Unable to communicate 575", xhr);
            vm.message = "We are unable to communicate due to network outage, please contact your Network Administrator";
            done();
          });
        // },
      //   function errorHandeler() {
      //     vm.message2 = "You must share your geolocation for this application to operate";
      //     $scope.$apply();
      //   }
      // );
    };

    this.addToPlan = function addToPlan(data){
      PlanService.addToPlan(data);
      console.log("Checking if I have todaysPlan",PlanService.todaysPlan);
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
    * @return {Promise}             It returns promise object
    */
    function parkList(coordinates){
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
          console.log("Each location URL",each.url);
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


    /**
    * This function retrives detail of each location.
    * @param  {[type]} parkUrl [description]
    * @return {[type]}         [description]
    */
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
     * This function stores park locations to local storage
     * @param  {Object} list        [Object containing array of locations list]
     * @param  {Object} coordinates [Coordinates of user's current location]
     * @return {Void}
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
  .controller("PlanController", PlanController);

  PlanController.$inject = ["PlanService"];


  function PlanController(PlanService){
    var vm = this;
    vm.yourPlan = PlanService.todaysPlan;

    vm.clearTodaysPlan = function clearTodaysPlan(){
      localStorage.removeItem("plan");
      vm.yourPlan = [];
    };
  }
}());

(function() {
  'use strict';

  angular.module("fairfax")
  .factory("PlanService", PlanService);

  var todaysPlan = [];
  var storedLocations = JSON.parse(localStorage.getItem("plan"));
  console.log("Stored Locations",storedLocations);
  todaysPlan = storedLocations || todaysPlan;


  function PlanService(){
    return {
      addToPlan: addToPlan,
      todaysPlan: todaysPlan,
      locationStorage: locationStorage

    };


    /**
     * [addToPlan description]
     * @param {[type]} data [description]
     */
    function addToPlan(data){

      var updatedObject = {
        name: null,
        feature: null,
        streetNumber: null,
        address: null,
        zip: null,
        phone: null,
        web: null
      };

      if (data.searchResults.PARKS_FCPA) {
        updatedObject.name = data.searchResults.PARKS_FCPA.PARK_NAME;
        updatedObject.feature = "Fairfax County Park";
        updatedObject.address = data.searchResults.PARKS_FCPA.STREET;
        updatedObject.zip = data.searchResults.PARKS_FCPA.ZIP_CODE;
      }
      else if (data.searchResults.Libraries) {
        updatedObject.name = data.searchResults.Libraries.DESCRIPTION;
        updatedObject.feature = "Fairfax County Library";
        updatedObject.streetNumber = data.searchResults.Libraries.STREET_NUMBER;
        updatedObject.address = data.searchResults.Libraries.STREET_NAME;
        updatedObject.zip = data.searchResults.Libraries.ZIP;
        updatedObject.phone = data.searchResults.Libraries.ERC_PHONE;
        updatedObject.web = data.searchResults.Libraries.WEB_ADDRESS;
      }
      else if (data.searchResults.COMMUNITY_CENTERS){
        updatedObject.name = data.searchResults.COMMUNITY_CENTERS.DESCRIPTION;
        updatedObject.feature = "Fairfax County Rec-center";
        updatedObject.streetNumber = data.searchResults.COMMUNITY_CENTERS.STREET_NUMBER;
        updatedObject.address = data.searchResults.COMMUNITY_CENTERS.STREET_NAME;
        updatedObject.zip = data.searchResults.COMMUNITY_CENTERS.ZIP;
        updatedObject.phone = data.searchResults.COMMUNITY_CENTERS.ERC_PHONE;
        updatedObject.web = data.searchResults.COMMUNITY_CENTERS.WEB_ADDRESS;
      }
      else {
        updatedObject.name = data.searchResults.SHOPPING_CENTERS.DESCRIPTIO;
        updatedObject.feature = "Fairfax County Shopping Center";
      }

      todaysPlan.push(updatedObject);
      locationStorage(todaysPlan);
      console.log("Right after locationStorage",todaysPlan);
    }


    /**
    * Stores choosen location to localStorage
    * @param  {Object} list [location that user wants to visit]
    * @return {void}
    */
    function locationStorage(todaysPlan){
      localStorage.setItem("plan", angular.toJson(todaysPlan));
      console.log("Saving location to localStorage", todaysPlan);
    }

  }

}());

(function() {
  'use strict';

  angular.module("fairfax")
  .controller("ShopController", ShopController);

  ShopController.$inject = ["$scope", "ShopService", "PlanService"];

  function ShopController($scope, ShopService, PlanService){

    var vm = this;
    vm.message = undefined;
    vm.message = undefined;
    vm.shopData = [];

    /**
    * [This function acquires location (latitude and longitude) of a user and execute shopList function]
    * @param {function} done this callback function get executed when the data is arrived
    * @return {Void}
    */
    this.getShop = function getShop(done){
      if (typeof(done) !== "function"){
        done = function(){};
      }

      navigator.geolocation.getCurrentPosition(
        function locationHandeler(location){
          console.log("location data",location);

          ShopService.shopList(location.coords)
          .then(function successHandeler(data){
            console.log("Getting Shopping Centers", data);
            vm.shopData = data;
            done();
          })
          .catch(function failHandeler(xhr){
            console.log("Unable to Communicate", xhr);
            vm.message = "We are unable to communicate due to network outage, please contact your Network Administrator";
            done();
          });
        },
        function errorHandeler(){
          vm.message2 = "You must share your geolocation for this application to operate";
          $scope.$apply();
        }
      );
    };

    this.addToPlan = function addToPlan(data){
      PlanService.addToPlan(data);
      console.log("Checking if I have todaysPlan",PlanService.todaysPlan);
    };

  }

}());

(function() {
  'use strict';

  angular.module("fairfax")
  .factory("ShopService", ShopService);

  var storedItems = JSON.parse(localStorage.getItem("shop"));
  storedItems = storedItems || {coordinates:{}};
  console.log(storedItems);



  ShopService.$inject = ["$http", "$q"];

  function ShopService($http, $q){
    return {
      shopList: shopList,
      updateLocalStorage: updateLocalStorage
    };


    /**
    * [This function retrieves list of shopping centers in Fairfax County by location of user]
    * @param  {Object} coordinates [object coordinates with two properties: latitude and longitude]
    * @return {Promise}             [It returns promise object]
    */
    function shopList(coordinates){
      if (!coordinates  || !coordinates.latitude || !coordinates.longitude){
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
        params:{
          feature: "shoppingcenters",
          format: "json",
          center: coordinates.latitude + "," + coordinates.longitude,
          distance: "10000"
        }
      })
      .then(function successHandeler(response){
        console.log("Getting Shopping data via ajax",response.data);

        var allPromises = response.data.searchResults.results.map(function shopDetail(each){
          console.log("Each location URL", each.url);
          return locationDetail(each.url);
        });
        return $q.all(allPromises);
      })
      .then(function allThingsDone(itemsDetails){
        console.log("itemsDetails & coordinates", itemsDetails, coordinates);
        updateLocalStorage(itemsDetails, coordinates);
        return itemsDetails;
      });
    }

    /**
    * This function retrives detail of each location.
    * @param  {Object} parkUrl [url to make an ajax call]
    * @return {Promise}         [It returns promise object]
    */
    function locationDetail(storeUrl){
      return $http({
        url: storeUrl,
        method: "GET"
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
     * This function stores shop locations to local storage
     * @param  {Object} list        [Object containing array of locations list]
     * @param  {Object} coordinates [Coordinates of user's current location]
     * @return {Void}             
     */
    function updateLocalStorage(list, coordinates){

      var data = {
        list: list,
        coordinates: {latitude: coordinates.latitude, longitude: coordinates.longitude}
      };
      console.log("Saving list of shopping centers to localStorage", data);
      localStorage.setItem("shop", angular.toJson(data));
    }
  }
}());
