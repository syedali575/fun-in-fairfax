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
