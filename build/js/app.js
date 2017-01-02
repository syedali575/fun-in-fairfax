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
      controller: "ShopController",
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

  LibraryController.$inject = ["LibraryService"];

  function LibraryController(LibraryService){
    
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
  }
}());

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
        console.log("path",response.data);
        return response.data.searchResults.results;
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
    vm.message = undefined;
    vm.parkData = [];


    /**
    * [This function acquires location (latitude and longitude) of a user and execute parkList function]
    * @return {Void}
    */
    this.getParks = function getParks(){

      navigator.geolocation.getCurrentPosition(function locationHandeler(location) {
        console.log(location);

        ParkService.parkList(location.coords)
        .then(function sucessHandeler(data){
          console.log("Getting Parks", data);
          vm.parkData = data;
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

      console.log("Am I making ajax call?");

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
        updateLocalStorage(response.data.searchResults.results, coordinates);
        return response.data.searchResults.results;
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
