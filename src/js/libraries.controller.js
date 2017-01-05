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
    * [This function acquires location (latitude and longitude) of a user and execute libraryList function]
    * @param {function} done this callback function excuted when the data is arrived
    * @return {Void}
    */
    this.getLibrary = function getLibrary(done){
      if (typeof(done) !== "function"){
        done = function(){};
      }

      navigator.geolocation.getCurrentPosition(
        function locationHandeler(location){
          console.log("location data",location);

          LibraryService.libraryList(location.coords)
          .then(function sucessHandeler(data){
            console.log("Getting Libraries", data);
            vm.libraryData = data;
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
