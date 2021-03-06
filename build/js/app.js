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
    * [This function provides static coordinates (latitude and longitude) of a user and execute centerList function]
    * @param {function} done this callback function get executed when the data is arrived
    * @return {Void}
    */
    this.getCenter = function getCenter(done){
      if (typeof(done) !== "function"){
        done = function(){};
      }

      var coordinates = {
        latitude: 38.7799510,
        longitude: -77.2829640
      };

      CenterService.centerList(coordinates)
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
    };

    /**
    * This function executes addToPlan function in PlanService
    * @param {Object} data Object containing location information
    */
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

  CenterService.$inject = ["$http", "$q"];

  function CenterService($http, $q){
    return {
      centerList: centerList,
      updateLocalStorage: updateLocalStorage
    };

    /**
    * This function retrieve list of Rec-centers from a specific geolocation.
    * This function also execute location detail function for each location in array.
    * @param  {Object} coordinates Object coordinates with two properties: latitude and longitude
    * @return {Promise}             Resolution of this promise is a list of Rec-centers locations and details.
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

        var allPromises = response.data.searchResults.results.map(function parkDetail(each){
          console.log(each.url);
          return locationDetail(each.url);
        });
        return $q.all(allPromises);
      })
      .then(function allThingsDone(itemsDetails) {
        updateLocalStorage(itemsDetails, coordinates);
        return itemsDetails;
      });
    }

    /**
    * This function retrives detail of each location.
    * @param  {Object} parkUrl [URL for each Rec-center location]
    * @return {Object}         [It returns a promise object]
    */
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
    * @param  {Object} list        Object containing array of locations list
    * @param  {Object} coordinates Coordinates of user's current location
    * @return {Void}
    */
    function updateLocalStorage(list, coordinates){

      var data = {
        list: list,
        coordinates: {latitude: coordinates.latitude, longitude: coordinates.longitude}
      };

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
    * [This function provides static coordinates (latitude and longitude) of a user and execute libraryList function]
    * @param {function} done this callback function get executed when the data is arrived
    * @return {Void}
    */
    this.getLibrary = function getLibrary(done){
      if (typeof(done) !== "function"){
        done = function(){};
      }


      var coordinates = {
        latitude: 38.7799510,
        longitude: -77.2829640
      };

      LibraryService.libraryList(coordinates)
      .then(function sucessHandeler(data){
        vm.libraryData = data;
        done();
      })
      .catch(function failHandeler(xhr){
        console.log("Unable to communicate", xhr);
        vm.message = "We are unable to communicate due to network outage, please contact your Network Administrator";
        done();
      });
    };

    /**
    * This function executes addToPlan function in PlanService
    * @param {Object} data Object containing location information
    */
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
    * @return {Promise}             Resolution of this promise is a list of library locations and details.
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

        var allPromises = response.data.searchResults.results.map(function libraryDetail(each){
          return locationDetail(each.url);
        });
        return $q.all(allPromises);
      })
      .then(function allThingDone(itemsDetails){
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
    vm.parkData = [];

    /**
    * [This function provides static coordinates (latitude and longitude) of a user and execute parkList function]
    * @param {function} done this callback function get executed when the data is arrived
    * @return {Void}
    */
    this.getParks = function getParks(done){
      if (typeof(done) !== "function"){
        done = function(){};
      }

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
      .catch(function failHandler(xhr){
        console.log("Unable to communicate 575", xhr);
        vm.message = "We are unable to communicate due to network outage, please contact your Network Administrator";
        done();
      });
    };

    /**
    * This function executes addToPlan function in PlanService
    * @param {Object} data Object containing location information
    */
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


  ParkService.$inject = ["$http", "$q"];

  function ParkService($http, $q){
    return {
      parkList: parkList,
      updateLocalStorage: updateLocalStorage
    };

    /**
    * This function retrieve list of parks from a specific geolocation.
    * This function also execute location detail function for each location in array.
    * @param  {Object} coordinates Object coordinates with two properties: latitude and longitude
    * @return {Promise}             Resolution of this promise is a list of park locations and details.
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

        var allPromises = response.data.searchResults.results.map(function parkDetail(each){
          return locationDetail(each.url);
        });
        return $q.all(allPromises);
      })
      .then(function allThingsDone(itemsDetails) {
        updateLocalStorage(itemsDetails, coordinates);
        return itemsDetails;
      });
    }


    /**
    * This function retrives detail of each location.
    * @param  {Object} parkUrl [URL for each park location]
    * @return {Object}         Resolves details of each specific park.
    */
    function locationDetail(parkUrl){
      return $http({
        url: parkUrl,
        method: "GET",
      })
      .then(function parkSuccessHandeler(response){
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
    vm.yourPlan = PlanService.getTodaysPlan();


    /**
    * This function clears out "plan" local storage, and make yourPlan empty.
    * @return {Void}
    */
    vm.clearTodaysPlan = function clearTodaysPlan(){
      PlanService.clear();
      vm.yourPlan = [];
    };
  }

}());

(function() {
  'use strict';

  angular.module("fairfax")
  .factory("PlanService", PlanService);




  function PlanService(){

    var todaysPlan = [];
    var storedLocations = JSON.parse(localStorage.getItem("plan"));
    console.log("Stored Locations",storedLocations);
    todaysPlan = storedLocations || todaysPlan;


    return {
      addToPlan: addToPlan,
      getTodaysPlan: getTodaysPlan,
      locationStorage: locationStorage,
      clear: clear
    };

    /**
    * This function returns todaysPlan
    * @return {Array} todaysPlan contains selected location to visit.
    */
    function getTodaysPlan() {
      return todaysPlan;
    }


    /**
    * This function converts inconsistent location objects from Fairfax County to structured objects.
    * This function also adds converted object to addToPlan array.
    * @param {Object} data Object containing location information.
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
      else if(data.searchResults.PARKS_NON_FCPA){
        updatedObject.name = data.searchResults.PARKS_NON_FCPA.NAME;
        updatedObject.feature = "Not Provided";
        updatedObject.address = "Not Provided";
        updatedObject.zip = "Not Provided";

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
    }


    /**
    * Stores choosen location to localStorage
    * @param  {Object} list [location that user wants to visit]
    * @return {void}
    */
    function locationStorage(planToSave){
      console.log(planToSave);
      localStorage.setItem("plan", angular.toJson(planToSave));
    }

    /**
    * This function clears out "plan" localStorage & creates and empties todaysPlan array.
    * @return {Void}
    */
    function clear() {
      localStorage.removeItem("plan");
      todaysPlan = [];
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
    vm.message2 = undefined;
    vm.shopData = [];

    /**
    * [This function provides static coordinates (latitude and longitude) of a user and execute shopList function]
    * @param {function} done this callback function get executed when the data is arrived
    * @return {Void}
    */
    this.getShop = function getShop(done){
      if (typeof(done) !== "function"){
        done = function(){};
      }

      var coordinates = {
        latitude: 38.7799510,
        longitude: -77.2829640
      };


      ShopService.shopList(coordinates)
      .then(function successHandeler(data){
        vm.shopData = data;
        done();
      })
      .catch(function failHandeler(xhr){
        console.log("Unable to Communicate", xhr);
        vm.message = "We are unable to communicate due to network outage, please contact your Network Administrator";
        done();
      });
    };


    /**
    * This function executes addToPlan function in PlanService
    * @param {Object} data Object containing location information
    */
    this.addToPlan = function addToPlan(data){
      PlanService.addToPlan(data);
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
    * This function retrieve list of shops from a specific geolocation.
    * This function also execute location detail function for each location in array.
    * @param  {Object} coordinates Object coordinates with two properties: latitude and longitude
    * @return {Promise}             Resolution of this promise is a list of shopping centers locations and details.
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

        var allPromises = response.data.searchResults.results.map(function shopDetail(each){
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
      localStorage.setItem("shop", angular.toJson(data));
    }
  }
}());
