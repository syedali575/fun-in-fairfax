(function() {
  'use strict';

  angular.module("fairfax")
  .controller("LibraryController", LibraryController);

  LibraryController.$inject = ["LibraryService", "PlanService"];

  function LibraryController(LibraryService, PlanService){

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

    this.addToPlan = function addToPlan(data){
      PlanService.addToPlan(data);
    };

  }
}());
