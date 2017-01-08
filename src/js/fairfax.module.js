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
