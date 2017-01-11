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
