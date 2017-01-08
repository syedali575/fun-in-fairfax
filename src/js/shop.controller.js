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
