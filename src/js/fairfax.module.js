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
