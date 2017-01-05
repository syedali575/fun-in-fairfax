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
