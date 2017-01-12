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
    * [This function provides static coordinates (latitude and longitude) of a user and execute libraryList function]
    * @param {function} done this callback function get executed when the data is arrived
    * @return {Void}
    */
    this.getLibrary = function getLibrary(done){
      if (typeof(done) !== "function"){
        done = function(){};
      }


      var coordinates = {
        latitude: 38.7799510,
        longitude: -77.2829640
      };

      LibraryService.libraryList(coordinates)
      .then(function sucessHandeler(data){
        vm.libraryData = data;
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
