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
