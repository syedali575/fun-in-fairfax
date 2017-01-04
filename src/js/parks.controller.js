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
